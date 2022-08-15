import {Injectable} from "@angular/core";
import Pusher, {Channel} from "pusher-js";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, delay, forkJoin, map, Observable, Subject, take} from "rxjs";
import {ConsigneeDataModel} from "../Data_Sharing/Model/ConsigneeData.model";
import {MessageModel} from "../Data_Sharing/Model/Message.model";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";
import {UserModel} from "../Data_Sharing/Model/user.model";
import {AsyncQueueModel} from "../Data_Sharing/Model/AsyncQueue.model";

interface UserInfoResponse {
  info_user : {
    profile_rec : {
      id: number,
      name: string,
      status: number,
      path_photo: string
    },
    lastMessage: {
      id_message: number
      message: string
      created_at: string
    },
    countNotread: number
  }
}

interface MessageListResponse {
  /*
When Open Any User From List Users it send to route chat or Somehow
Instance of ConsigneeDataModel it represents this User you need to Send to him
*/
  messages : {
    id : number ,
    id_send : number ,
    id_recipient : number ,
    message : string ,
    read_at : string | null , // Date && as Whatsapp check if user read this message
    created_at : string , //Date
  }[];
  current_page : number;
  url_next_page: string | null ;
  url_first_page: string ;
  url_last_page: string ;
  total_items: number ;
}

interface SendResponse {
  id_message : number ;
  created_at : string ;
}

interface ChannelResponse {
  id_user : number ;
  message ?: {
    id : number ,
    id_send : number ,
    id_recipient : number ,
    message : string ,
    read_at : string | null // Date
    created_at : string //Date
  };
  status ?: boolean ;
}

interface UpdateStateService {
  Status : ServiceAvailable ;
  Action ?: ServiceAction ;
  ActiveUpdate ?: {
    FetchIndex : number ,
    UserID : number ,
    Active : boolean
  };
  ServiceInfo : {
    IsDone : boolean ,
    LengthUserCache : number ,
    LengthUserView : number
    IDSelected : number | null ,
  };
}

interface InitialDataResponse {
  users : {
    id : number ,
    LastMessageDate : string ,
    UnReadMessages : number ,
  }[];
}

interface InitialData {
  [ID_User : number] : {
    DateLastMessage : Date ;
    UnreadMessage : number ;
    IsFetch : boolean ;
    UsersFetchIndex ?: number ;
  }
}

@Injectable({providedIn : 'root'})
export class MessageService {

  private UsersFetch : ConsigneeDataModel[] ;
  private UserCache : InitialData ;
  private PusherProcess !: Pusher ;
  private UserChannel !: Channel ;
  private Account : UserModel | null ;
  private IsDone : boolean ;
  private AnyChange : boolean ;
  private UnReadMessages : number
  private IDSelected : number | null ;
  private UserCacheLength : number ;
  private QueueUpdate : AsyncQueueModel ;
  readonly UpdateState : BehaviorSubject<UpdateStateService> ;
  Communication : Subject<MessageModel> | null ;

  constructor(private HTTP : HttpClient , private AuthenticationInfo : AuthenticationService) {
    this.Account = null ;
    this.IDSelected = null ;
    this.UsersFetch = [] ;
    this.UserCache = {} ;
    this.IsDone = false ;
    this.AnyChange = false ;
    this.UnReadMessages = 0 ;
    this.UserCacheLength = 0 ;
    this.QueueUpdate = new AsyncQueueModel() ;
    this.UpdateState = new BehaviorSubject<UpdateStateService>({
      Status : ServiceAvailable.NotAvailable ,
      ServiceInfo : {
        IsDone : false ,
        LengthUserCache : 0 ,
        LengthUserView : 0 ,
        IDSelected : null
      }
    }) ;
    this.Communication = null ;
    this.StartService() ;
  }

  private StartService(): void {
    this.QueueUpdate.UpdateListen().subscribe((Value) => {
      if(this.Account != null) {
        if(Value == "Wait" && this.AnyChange) {
          this.AnyChange = false ;
          this.SendUpdate(ServiceAvailable.Available , ServiceAction.UsersUpdate);
        }
      }
    });
    this.AuthenticationInfo.Account.subscribe((DataAuth : UserModel | null) => {
      if(DataAuth != null) {
        this.Account = DataAuth ;
        this.InitialChat().pipe(take(1)).subscribe((DataInit) => {
          this.UserCache = DataInit ;
          this.InitialPusher(DataAuth.ID);
          this.SendUpdate(ServiceAvailable.Available);
        });
      } else {
        this.UserCache = {} ;
        this.UsersFetch = [] ;
        if(this.PusherProcess != undefined) {
          this.UserChannel.cancelSubscription();
          this.PusherProcess.disconnect() ;
        }
        this.Account = null ;
        this.SendUpdate(ServiceAvailable.Available , ServiceAction.UsersUpdate);
        //this.SendUpdate(ServiceAvailable.NotAvailable , ServiceAction.UsersUpdate);
      }
    });
  }

  private InitialChat() {
    let Options = {
      headers : new HttpHeaders({"Authorization" : (<UserModel>this.Account).GetToken()})
    }
    return this.HTTP.get<InitialDataResponse>(`${AuthenticationService.API_Location}api/chat/chats` ,Options)
      .pipe(map((InitialDataUser) => {
        let DataResponse : InitialData = {} ;
        InitialDataUser.users.forEach((Value) => {
          DataResponse[Value.id] = {
            DateLastMessage : new Date(Value.LastMessageDate) ,
            UnreadMessage : Value.UnReadMessages ,
            IsFetch : false
          };
          this.UnReadMessages += Value.UnReadMessages ;
          this.UserCacheLength++ ;
        });
        return DataResponse ;
      }));
  }

  private InitialPusher(User_ID : number) {
    this.PusherProcess = new Pusher("98034be202413ea485fc" , {
      cluster : "ap2" ,
      authEndpoint : `${AuthenticationService.API_Location}api/broadcasting/auth` ,
      auth : {
        headers : {
          Authorization : this.Account?.GetToken()
        }
      },
    }) ;
    this.UserChannel = this.PusherProcess.subscribe(`private-Room.Chat.${User_ID}`);
    this.UserChannel.bind("ChatEvent" , (DataReceive : ChannelResponse) => {
      let ID_Sender : number ;
      if(DataReceive.id_user != undefined)
        ID_Sender = DataReceive.id_user ;
      else
        ID_Sender = <number>DataReceive.message?.id_send ;
      let InitialDataUser = this.UserCache[ID_Sender] ;
      if(DataReceive.status != undefined) {
        if(InitialDataUser && InitialDataUser.IsFetch) {
          this.UsersFetch[<number>InitialDataUser.UsersFetchIndex]
            .IsActive = DataReceive.status;
          this.SendUpdate(ServiceAvailable.Available , ServiceAction.ActiveUpdate ,
            {Index : <number>InitialDataUser.UsersFetchIndex , Active : DataReceive.status}) ;
        }
      } else if(DataReceive.message != undefined) {
        //let IsSelected = (this.IDSelected != null && this.IDSelected == DataReceive.ID) ;
        if(InitialDataUser == undefined) {
          InitialDataUser = {
            DateLastMessage : new Date(DataReceive.message.created_at) ,
            UnreadMessage : 1 ,
            IsFetch : true ,
          }
          this.UserCache[ID_Sender] = InitialDataUser ;
        } else {
          InitialDataUser.DateLastMessage = new Date(DataReceive.message.created_at);
          InitialDataUser.UnreadMessage++ ;
        }
        this.UnReadMessages++;
        let TaskIO !: number ;
        let MessageInfo = new MessageModel(DataReceive.message.id , DataReceive.message.id_send
          , DataReceive.message.id_recipient , DataReceive.message.message , new Date(DataReceive.message.created_at)) ;

        TaskIO = this.QueueUpdate.Push(() => {
          if (DataReceive.message == undefined) {
            this.QueueUpdate.Pop();
            return;
          }
          if(InitialDataUser.UsersFetchIndex != undefined) {
            this.UsersFetch[InitialDataUser.UsersFetchIndex].ReceiveMessage(MessageInfo) ;
            this.UsersFetch[InitialDataUser.UsersFetchIndex].UnReadMessage++ ;
            this.SortDateMessage(false , ID_Sender) ;
            this.QueueUpdate.Pop();
          } else {
            this.FetchUserInfo(ID_Sender).pipe(take(1))
              .subscribe((UserData) => {
                this.UsersFetch.push(UserData);
                InitialDataUser.UsersFetchIndex = this.UsersFetch.length - 1 ;
                this.SortDateMessage(false , ID_Sender) ;
                UserData.ReceiveMessage(MessageInfo);
                this.QueueUpdate.Pop();
              });
          }
          if(this.Communication != null &&
            this.IDSelected != null && this.IDSelected == ID_Sender) //ID
              this.Communication.next(MessageInfo);
        } , true);
        const Listener = this.QueueUpdate.SendRegister.pipe(delay(0))
          .subscribe((Value) => {
          if(TaskIO == Value) {
            Listener.unsubscribe();
            this.AnyChange = true ;
          }
        });
      }
    });
  }

  private FetchUserInfo(ID_User : number) {
    let Options = {
      headers : new HttpHeaders({"Authorization" :(<UserModel>this.Account).GetToken()}) ,
      params : new HttpParams().set("id_user" , ID_User) ,
    };
    return this.HTTP.get<UserInfoResponse>(`${AuthenticationService.API_Location}api/chat/info` , Options).
    pipe(map((Data : UserInfoResponse) => {
      return new ConsigneeDataModel(Data.info_user.profile_rec.id,
        AuthenticationService.API_Location.concat(Data.info_user.profile_rec.path_photo),
        Data.info_user.profile_rec.name, !!(Data.info_user.profile_rec.status),
        Data.info_user.countNotread, (Data.info_user.lastMessage != undefined)? Data.info_user.lastMessage.message : undefined,
        (Data.info_user.lastMessage != undefined)? new Date(Data.info_user.lastMessage.created_at) : undefined) ;
    }));
  }

  private FetchPackageMessage(ID_B : number , Page : number) {
    let Params = new HttpParams().set("id_recipient" , ID_B);
    Params = Params.append("page" , Page);
    return this.HTTP.get<MessageListResponse>(`${AuthenticationService.API_Location}api/chat/show` , {
      headers : new HttpHeaders({"Authorization" : (<UserModel>this.Account).GetToken()}) ,
      params : Params ,
    }).pipe(map((DataResponse : MessageListResponse) => {
      let Data_Response : MessageModel[] = [] ;
      DataResponse.messages.map(UserData => {
        let Message = new MessageModel(UserData.id , UserData.id_send , UserData.id_recipient ,
          UserData.message , new Date(UserData.created_at));
        Data_Response.push(Message);
      });
      return Data_Response ;
    }));
  }

  private SortDateMessage(SortComplex : boolean , ID ?: number) {
    if(this.UsersFetch.length <= 1)
      return;
    if(SortComplex) {
      this.UsersFetch = this.UsersFetch.sort((A , B) => {
        let Date_A : Date = A.DateLastMessage ,
          Date_B : Date = B.DateLastMessage ;
        if(Date_A < Date_B) return 1 ;
        if(Date_A > Date_B) return -1 ;
        return 0 ;
      });
      this.UsersFetch.forEach((Value , Index) =>
        this.UserCache[Value.UserID].UsersFetchIndex = Index
      ) ;
    } else {
      if(ID == undefined)
        return ;
      let IndexFetch = <number>this.UserCache[ID].UsersFetchIndex ;
      this.UsersFetch.unshift(this.UsersFetch.splice(IndexFetch , 1)[0]);
      this.UserCache[this.UsersFetch[0].UserID].UsersFetchIndex = 0 ;
      this.UserCache[this.UsersFetch[1].UserID].UsersFetchIndex = 1 ;
    }
  }

  private SendUpdate(State : ServiceAvailable , Action ?: ServiceAction
                     , ActiveData ?: {Index : number , Active : boolean}) {
    let Temp : UpdateStateService ;
    switch (State) {
      case ServiceAvailable.NotAvailable :
        Temp = {
          Status : ServiceAvailable.NotAvailable ,
          ServiceInfo : {
            IsDone : this.IsDone ,
            LengthUserCache : this.UserCacheLength ,
            LengthUserView : this.UsersFetch.length ,
            IDSelected : this.IDSelected
          }
        };
        break ;
      case ServiceAvailable.Available :
        if(Action == ServiceAction.ActiveUpdate) {
          if(ActiveData == undefined)
            Temp = {
              Status : ServiceAvailable.Available ,
              ServiceInfo : {
                IsDone : this.IsDone ,
                LengthUserCache : this.UserCacheLength ,
                LengthUserView : this.UsersFetch.length ,
                IDSelected : this.IDSelected
              }
            };
          else
            Temp = {
            Status : ServiceAvailable.Available ,
            Action : ServiceAction.ActiveUpdate ,
            ActiveUpdate : {
              FetchIndex : ActiveData.Index ,
              UserID : this.UsersFetch[ActiveData.Index].UserID ,
              Active : ActiveData.Active
            } ,
            ServiceInfo : {
              IsDone : this.IsDone ,
              LengthUserCache : this.UserCacheLength ,
              LengthUserView : this.UsersFetch.length ,
              IDSelected : this.IDSelected
            }
          };
        } else if(Action == ServiceAction.UsersUpdate) {
          Temp = {
            Status : ServiceAvailable.Available ,
            Action : ServiceAction.UsersUpdate ,
            ServiceInfo : {
              IsDone : this.IsDone ,
              LengthUserCache : this.UserCacheLength ,
              LengthUserView : this.UsersFetch.length ,
              IDSelected : this.IDSelected
            }
          };
        } else {
          Temp = {
            Status : ServiceAvailable.Available ,
            ServiceInfo : {
              IsDone : this.IsDone ,
              LengthUserCache : this.UserCacheLength ,
              LengthUserView : this.UsersFetch.length ,
              IDSelected : this.IDSelected
            }
          };
        }
        break ;
    }
    this.UpdateState.next(Temp);
  }

  public FetchPackageUser(Batch : number) : void {
    this.QueueUpdate.Pause();
    this.SendUpdate(ServiceAvailable.NotAvailable);
    if(this.IsDone) {
      this.SendUpdate(ServiceAvailable.Available);
      this.QueueUpdate.Continue();
      return ;
    }
    let UserCache2Array = [] ;
    for(let Temp in this.UserCache)
      UserCache2Array.push({
        ID : +Temp ,
        DataUser : this.UserCache[Temp]
      });
    UserCache2Array = UserCache2Array.sort((A , B) => {
      let Date_A : Date = A.DataUser.DateLastMessage ,
        Date_B : Date = B.DataUser.DateLastMessage ;
      if(Date_A < Date_B) return 1 ;
      if(Date_A > Date_B) return -1 ;
      return 0 ;
    });
    let ObservableList : Observable<ConsigneeDataModel>[] = [] ;
    UserCache2Array.forEach((Value) => {
      if(ObservableList.length >= Batch)
        return ;
      if(!Value.DataUser.IsFetch) {
        ObservableList.push(this.FetchUserInfo(Value.ID));
      }
    });
    this.IsDone = (ObservableList.length < Batch) ;
    if(ObservableList.length == 0) {
      this.SendUpdate(ServiceAvailable.Available);
      this.QueueUpdate.Continue();
      return ;
    }
    forkJoin([...ObservableList]).pipe(map((DataResponse) => {
      DataResponse.forEach((Value) => {
        this.UsersFetch.push(Value);
        this.UserCache[Value.UserID].IsFetch = true ;
        this.UserCache[Value.UserID].UsersFetchIndex = this.UsersFetch.length - 1 ;
      });
      this.SortDateMessage(true);
    })).subscribe(() => {
      if(this.QueueUpdate.StateSnapShot() == "Wait")
        this.SendUpdate(ServiceAvailable.Available , ServiceAction.UsersUpdate);
      else
        this.AnyChange = true ;
      this.QueueUpdate.Continue();
    });
  }

  public FetchMessageList(ID_B : number) {
    if(!this.UserCache[ID_B].IsFetch)
      return { Done : false };
    let InfoUser = this.UsersFetch[<number>this.UserCache[ID_B].UsersFetchIndex];
    if(InfoUser.GetInfoMessages().Done)
      return { Done : true };
    let PageNumber = InfoUser.GetInfoMessages().Page ;
    let ObservableList : Observable<MessageModel[]>[] = [] ;
    if(PageNumber % 1 == 0) {
      ObservableList.push(this.FetchPackageMessage(ID_B , PageNumber));
    } else {
      let Temp = Math.floor(PageNumber) ;
      ObservableList.push(this.FetchPackageMessage(ID_B , Temp));
      ObservableList.push(this.FetchPackageMessage(ID_B , Temp+1));
    }
    return forkJoin([...ObservableList]).pipe(take(1) , map((DataResponse) => {
      let DataFinal : MessageModel[] = [] ;
      if(PageNumber % 1 == 0) {
        DataFinal.push(...DataResponse[0]);
        InfoUser.SetMessageList(DataFinal , (DataFinal.length != 10)) ;
        return {
          Data : DataFinal ,
          Done : (DataFinal.length != 10)
        };
      }
      else {
        let TempNum = ((PageNumber % 1) * 10) - 1 ;
        DataResponse[0].forEach((Value , Index) => {
          if(Index > TempNum)
            DataFinal.push(Value);
        });
        DataResponse[1].forEach(Value => DataFinal.push(Value));
        InfoUser.SetMessageList(DataFinal , ((DataResponse[0].length + DataResponse[1].length) != 20)) ;
        return {
          Data : DataFinal ,
          Done : (DataResponse[0].length + DataResponse[1].length) != 20 ,
        };
      }
    }));
  }

  public SendMessage(ID_To : number , Message_Content : string ) {
    return this.HTTP.post<SendResponse>(`${AuthenticationService.API_Location}api/chat/send` , {
      id_recipient : ID_To ,
      message : Message_Content ,
    } , {headers : new HttpHeaders({"Authorization" : (<UserModel>this.Account).GetToken()}) })
      .pipe(take(1) , map((DataMessage : SendResponse) => {
        let MessageInfo =  new MessageModel(DataMessage.id_message , (<UserModel>this.Account).ID ,
          ID_To , Message_Content , new Date(DataMessage.created_at)) ;
        if(this.UserCache[ID_To] == undefined) {
          this.FetchUserInfo(ID_To).subscribe(Value => {
            Value.ReceiveMessage(MessageInfo);
            this.UsersFetch.push(Value);
            this.UserCache[ID_To] = {
              DateLastMessage : MessageInfo.Message_Date ,
              UnreadMessage : 0 ,
              IsFetch : true ,
              UsersFetchIndex : this.UsersFetch.length - 1
            } ;
            this.SortDateMessage(false , ID_To);
            this.SendUpdate(ServiceAvailable.Available , ServiceAction.UsersUpdate) ;
          });
        } else {
          let Index = <number>this.UserCache[MessageInfo.ID_Receive].UsersFetchIndex ;
          this.UsersFetch[Index].ReceiveMessage(MessageInfo);
          this.SortDateMessage(false , MessageInfo.ID_Receive);
          this.SendUpdate(ServiceAvailable.Available , ServiceAction.UsersUpdate) ;
        }
        return {...MessageInfo} ;
      }));
  }

  public SendReadMessage(ID_Sender : number) {
    return this.HTTP.post(`${AuthenticationService.API_Location}api/chat/read` , {
      id_send : ID_Sender ,
    } , {headers : new HttpHeaders({"Authorization" : (<UserModel>this.Account).GetToken()}) })
      .pipe(take(1) , map((Value) => {
        if(!(Value instanceof HttpErrorResponse)) {
          this.UnReadMessages -= this.UserCache[ID_Sender].UnreadMessage ;
          this.UserCache[ID_Sender].UnreadMessage = 0 ;
          if(this.UserCache[ID_Sender].UsersFetchIndex != undefined)
            this.UsersFetch[<number>this.UserCache[ID_Sender].UsersFetchIndex].UnReadMessage = 0 ;
          return true ;
        } else
          return false ;
      }));
  }

  public GetUnReadMessage() : number {
    return this.UnReadMessages ;
  }

  public SetIDSelected(ID ?: number) {
    if(ID != undefined) {
      this.IDSelected = ID ;
      //Change TempIndex : number to TempIndex : this.UsersFetch[TempIndex] Block
      let TempIndex = <number>this.UserCache[ID].UsersFetchIndex ;
      this.Communication = new Subject<MessageModel>();
      return this.UsersFetch[TempIndex].GetAllMessage() ;
    } else {
      this.IDSelected = null ;
      this.Communication = null ;
      return null ;
    }
  }

  public GetUserView() {
    let Result : {
      UserID : number ,
      UserName : string ,
      ImagePath : string ,
      IsActive : boolean ,
      LastMessage : string ,
      DateLastMessage : Date ,
      UnReadMessage : number
    }[] = [] ;
    this.UsersFetch.forEach((Value) => Result.push(Value) );
    return Result ;
  }

  public GetAccountInfo() {
    return this.Account?.Clone() ;
  }

  public GetUserInfo(ID : number) {
    let Index = this.UserCache[ID].UsersFetchIndex ;
    if(Index == undefined)
      return undefined;
    return this.UsersFetch[Index].GetClone() ;
  }
}

export enum ServiceAvailable {
  Available ,
  NotAvailable
}

export enum ServiceAction {
  UsersUpdate ,
  ActiveUpdate ,
}
