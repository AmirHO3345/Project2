import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {MessageModel} from "../../Data_Sharing/Model/Message.model";
import {MessageService, StateService} from "../message.service";
import {ActivatedRoute} from "@angular/router";
import {UserModel} from "../../Data_Sharing/Model/user.model";
import {Observable, Subscription} from "rxjs";
import {AbstractControl, NgForm} from "@angular/forms";
import {User} from "../../Ahmad/user.model";
import {TimeService} from "../../Data_Sharing/Services/time.service";

interface DataPerson {
  ID : number ,
  Name : string ,
  ImagePath : string
}

interface ServiceInfo  {
  IsDone : boolean ;
  LengthUserCache : number ;
  LengthUserView : number ;
  IDSelected : number | null ;
  IsServiceAvailable : boolean ;
}

@Component({
  selector : 'app-chat' ,
  templateUrl : "./chat.component.html",
  styleUrls : ['../../Data_Sharing/BootStraps/bootstrap400.css' , './chat.component.css'
    , '../../Fonts/css/font-awesome.css']
})
export class ChatComponent implements OnInit , AfterViewInit , OnDestroy {

  AccountInfo : DataPerson ;
  User_Texting !: DataPerson ;
  ServiceState !: ServiceInfo ;
  AllMessage : MessageModel[] ;
  Listener !: Subscription ;
  Current_Date : Date ;
  IsDone : boolean ;

  constructor(private ChatProcessor : MessageService , private route : ActivatedRoute ,
              private Timer : TimeService) {
    let Temp = <UserModel>this.ChatProcessor.GetAccountInfo() ;
    this.AccountInfo = {
      ID : Temp.ID ,
      Name : Temp.UserName ,
      ImagePath : Temp.ImagePath
    }
    this.AllMessage = [] ;
    this.IsDone = false ;
    this.Current_Date = new Date();
  }

  ngOnInit(): void {
    this.Timer.UpdateTime.subscribe((Value) => this.Current_Date = Value);
    this.ChatProcessor.UpdateState.subscribe((Value) => {
      let Available : boolean ;
      Available = (Value.Status != StateService.Loading);
      this.ServiceState = {
        IsDone : Value.ServiceInfo.IsDone ,
        LengthUserCache : Value.ServiceInfo.LengthUserCache ,
        LengthUserView : Value.ServiceInfo.LengthUserView ,
        IDSelected : Value.ServiceInfo.IDSelected ,
        IsServiceAvailable : Available
      }
    });
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe((Param) => {
      if(this.Listener != undefined)
        this.Listener.unsubscribe();
      this.AllMessage = [] ;
      let Last_User = +Param['id'] ;
      let Temp = setInterval(() => {
        if(Last_User != +Param['id'])
          clearInterval(Temp);
        if(this.ServiceState.IsServiceAvailable) {
          if (this.ServiceState.LengthUserView > 0 ||
            this.ServiceState.LengthUserCache == 0) {
            clearInterval(Temp);
            this.RouteParamsSetting(+Param['id']);
          }
        }
      } , 1000);
    });
  }

  private RouteParamsSetting(IdUserTexting : number) {
    let UserTemp = this.ChatProcessor.GetUserInfo(IdUserTexting);
    if(UserTemp == undefined)
      return ; //Close Chat
    this.User_Texting = {
      ID : UserTemp.UserID ,
      Name : UserTemp.UserName ,
      ImagePath : UserTemp.ImagePath
    };
    let Temp = <MessageModel[]>this.ChatProcessor.SetIDSelected(this.User_Texting.ID);
    if(Temp.length > 0)
      this.AllMessage = Temp ;
    else {
      let Temp = this.ChatProcessor.FetchMessageList(this.User_Texting.ID);
      if(Temp instanceof Observable) {
        let ObserveTemp = Temp.subscribe((Value) => {
          this.AllMessage.push(...Value.Data);
          this.IsDone = Value.Done ;
          ObserveTemp.unsubscribe();
        });
      }
    }
    if(this.ChatProcessor.Communication != null)
      this.Listener = this.ChatProcessor.Communication.subscribe((Value) => {
        this.AllMessage.push(Value);
      });
  }

  public SendMessage(FormData : NgForm) {
    let FieldInputForm : AbstractControl = <AbstractControl>FormData.form.get("message") ;
    this.ChatProcessor.SendMessage(this.User_Texting.ID , FieldInputForm.value)
      .subscribe((Value) => this.AllMessage.push(Value) );
    FieldInputForm.reset();
  }

  ngOnDestroy(): void {
    if(this.Listener != undefined)
      this.Listener.unsubscribe();
    this.ChatProcessor.SetIDSelected();
    this.AllMessage = [] ;
  }
}
