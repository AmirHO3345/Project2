import {BehaviorSubject, map} from "rxjs";

export class AsyncQueueModel {

  private Function_Storage : {
    callBack : Function ,
    Register_ID : number ,
    // If there are Async Task then preferable True Value else False Value
    Pop_Manually : boolean
  }[] ;
  private Register_ID : number ;
  private Current_State : Status ;
  private readonly State : BehaviorSubject<Status>;
  readonly SendRegister : BehaviorSubject<number> ;
  private PendingProcess : boolean ;

  constructor() {
    this.Function_Storage = [] ;
    this.Register_ID = 0 ;
    this.State = new BehaviorSubject<Status>(Status.Wait);
    this.Current_State = Status.Wait ;
    this.SendRegister = new BehaviorSubject<number>(0) ;
    this.PendingProcess = false ;

    this.State.subscribe((Value) => {
      this.Current_State = Value ;
      switch(Value) {
        case Status.Run :
          this.Process();
          return;
        case Status.Stop:
          this.Stop();
          return;
        case Status.Continue :
          if(!this.PendingProcess) {
            if(this.Function_Storage.length == 0)
              this.State.next(Status.Wait);
            else
              this.State.next(Status.Run);
            this.PendingProcess = false ;
          }
          return;
      }
    });
  }

  private Process() {
    let FuncData = this.Function_Storage[0] ;
    FuncData.callBack() ;
    if(!FuncData.Pop_Manually)
      this.Pop();
  }

  private Stop() {
    this.Function_Storage = [] ;
    this.State.complete();
    this.SendRegister.complete();
  }

  Push(CallBack : Function , PopManually = false) : number {
    let ID = this.Register_ID++ ;
    let Temp = {
      callBack : CallBack ,
      Register_ID : ID ,
      Pop_Manually : PopManually
    }
    this.Function_Storage.push(Temp);
    if(this.Current_State == Status.Wait)
      this.State.next(Status.Run);
    return ID ;
  }

  Pop() {
    if(this.Current_State == Status.Stop)
      return ;
    if(this.Current_State == Status.Pause) {
      this.PendingProcess = true ;
      let Listen = this.State.subscribe((Value) => {
        if(Value == Status.Continue) {
          Listen.unsubscribe();
          this.SendRegister.next(this.Function_Storage[0].Register_ID);
          this.Function_Storage.shift();
          this.PendingProcess = false ;
          if(this.Function_Storage.length == 0)
            this.State.next(Status.Wait);
          else
            this.State.next(Status.Run);
        }
      });
    } else if(this.Current_State == Status.Run ||
      this.Current_State == Status.Continue) {
      this.SendRegister.next(this.Function_Storage[0].Register_ID);
      this.Function_Storage.shift();
      if(this.Function_Storage.length == 0)
        this.State.next(Status.Wait);
      else
        this.State.next(Status.Run);
    }
  }

  DeleteFunc(ID_Func : number) {
    this.State.next(Status.Pause);
    if(this.Function_Storage[0].Register_ID != ID_Func)
      this.Function_Storage.forEach((Value, Index) => {
        if(Value.Register_ID == ID_Func)
          this.Function_Storage.splice(Index , 1) ;
      });
    this.State.next(Status.Continue);
  }

  Pause() {
    this.State.next(Status.Pause);
  }

  Continue() {
    this.State.next(Status.Continue);
  }

  UpdateListen() {
    return this.State.pipe(map((Value) => {
      return Status[Value] ;
    }));
  }

  StateSnapShot() : string {
    return Status[this.Current_State] ;
  }
}

enum Status {
  Run ,
  Pause , //User
  Continue, //User
  Stop , //User
  Wait, // Mean The Queue Is With any function to Process cause it is empty
}
