import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MessageModel} from "../../Data_Sharing/Model/Message.model";
import {MessageService, ServiceAction, ServiceAvailable} from "../message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserModel} from "../../Data_Sharing/Model/user.model";
import {Observable, Subscription} from "rxjs";
import {AbstractControl, NgForm} from "@angular/forms";
import {TimeService} from "../../Data_Sharing/Services/time.service";
import {ScrollTrackDirective} from "../../Data_Sharing/Directives/ScrollTrack.directive";

interface DataPerson {
  ID : number ,
  Name : string ,
  ImagePath : string ,
  IsActive : boolean
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

  @ViewChild('Scroller') ScrollControl !: ScrollTrackDirective ;
  // ConsigneeDataModel
  AccountInfo : DataPerson ; //Me
  User_Texting !: DataPerson ; // Anthor User
  ServiceState !: ServiceInfo ;
  IsScrollRun : boolean ;
  AllMessage : MessageModel[] ;
  Listener !: Subscription ;
  Current_Date : Date ;
  IsDone : boolean ;

  constructor(private ChatProcessor : MessageService , private route : ActivatedRoute ,
              private Nav : Router, private Timer : TimeService) {
    let Temp = <UserModel>this.ChatProcessor.GetAccountInfo() ;
    this.AccountInfo = {
      ID : Temp.ID ,
      Name : Temp.UserName ,
      ImagePath : Temp.ImagePath ,
      IsActive : true
    }
    this.AllMessage = [] ;
    this.IsDone = false ;
    this.IsScrollRun = false ;
    this.Current_Date = new Date();
  }

  ngOnInit(): void {
    this.Timer.UpdateTime.subscribe((Value) => this.Current_Date = Value);
    this.ChatProcessor.UpdateState.subscribe((Value) => {
      let Available = (Value.Status != ServiceAvailable.NotAvailable) ;
      this.ServiceState = {
        IsDone : Value.ServiceInfo.IsDone ,
        LengthUserCache : Value.ServiceInfo.LengthUserCache ,
        LengthUserView : Value.ServiceInfo.LengthUserView ,
        IDSelected : Value.ServiceInfo.IDSelected ,
        IsServiceAvailable : Available
      };
      if(Available && Value.Action == ServiceAction.ActiveUpdate) {
        if(Value.ActiveUpdate != undefined && this.User_Texting != undefined)
          if(Value.ActiveUpdate.UserID == this.User_Texting.ID)
            this.User_Texting.IsActive = Value.ActiveUpdate.Active ;
      }
    });
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe((Param) => {
      this.IsScrollRun = false ;
      if(this.Listener != undefined)
        this.Listener.unsubscribe();
      this.AllMessage = [] ;
      let Last_User = +Param['id'] ;
      let Temp = setInterval(() => {
        // If Custmer Change to Anthor User then this Request is Abort
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
    this.ScrollControl.Scroller_Info.subscribe((ScrollValue) => {
      if(this.IsScrollRun && this.ServiceState.IsServiceAvailable
        && this.ScrollControl.AccessStart(0.08)) {
        this.IsScrollRun = false ;
        let Temp = this.ChatProcessor.FetchMessageList(this.User_Texting.ID) ;
        if(Temp instanceof Observable) {
          Temp.subscribe(MessageValue => {
            this.AllMessage.unshift(...MessageValue.Data);
            setTimeout(() => {
              this.ScrollControl.ScrollTo(undefined , ScrollValue.HeightScroll) ;
            } , 1);
            this.IsDone = MessageValue.Done ;
            this.IsScrollRun = true ;
          });
        } else {
          this.IsDone = Temp.Done;
          this.IsScrollRun = true ;
        }
      }
    });
  }

  private RouteParamsSetting(IdUserTexting : number) {
    let UserTemp = this.ChatProcessor.GetUserInfo(IdUserTexting);
    if(UserTemp == undefined)
      // Navigate To Page 404
      return ; //Close Cha
    this.User_Texting = {
      ID : UserTemp.UserID ,
      Name : UserTemp.UserName ,
      ImagePath : UserTemp.ImagePath ,
      IsActive : UserTemp.IsActive
    };
    let Temp_1 = <MessageModel[]>this.ChatProcessor.SetIDSelected(this.User_Texting.ID);
    if(Temp_1.length > 9) {
      this.AllMessage = Temp_1 ;
      setTimeout(() => {
        this.ScrollControl.ScrollTo(false);
        this.ChatProcessor.SendReadMessage(this.User_Texting.ID).subscribe();
        this.IsScrollRun = true ;
      } , 1);
    } else {
        let Temp_2 = this.ChatProcessor.FetchMessageList(this.User_Texting.ID);
        if(Temp_2 instanceof Observable) {
          let ObserveTemp = Temp_2.subscribe((Value) => {
            if(Temp_1.length > 0) {
              this.AllMessage = Temp_1 ;
              this.AllMessage.unshift(...Value.Data);
            } else
              this.AllMessage.push(...Value.Data);
            this.IsDone = Value.Done ;
            this.IsScrollRun = true ;
            setTimeout(() => {
              this.ScrollControl.ScrollTo(false);
            } , 100);
            this.ChatProcessor.SendReadMessage(this.User_Texting.ID).subscribe();
            ObserveTemp.unsubscribe();
          });
        } else if(Temp_2.Done) {
          this.AllMessage = Temp_1 ;
          this.IsScrollRun = true ;
          setTimeout(() => {
            this.ScrollControl.ScrollTo(false);
          } , 100);
          this.ChatProcessor.SendReadMessage(this.User_Texting.ID).subscribe();
        }
    }
    if(this.ChatProcessor.Communication != null)
      this.Listener = this.ChatProcessor.Communication.subscribe((Value) => {
        this.AllMessage.push(Value);
        if(this.ScrollControl.AccessEnd(0.06))
          setTimeout(() => {
            this.ScrollControl.ScrollTo(false);
          } , 100)
        this.ChatProcessor.SendReadMessage(this.User_Texting.ID).subscribe();
      });
  }

  public SendMessage(FormData : NgForm) {
    let FieldInputForm : AbstractControl = <AbstractControl>FormData.form.get("message") ;
    this.ChatProcessor.SendMessage(this.User_Texting.ID , FieldInputForm.value)
      .subscribe((Value) => {
        if(Value instanceof Observable)
          return ;
        this.AllMessage.push(Value) ;
        setTimeout(() => {
          this.ScrollControl.ScrollTo(false);
        } , 100);
      });
    FieldInputForm.reset();
  }

  public GoProfile(ID : number) {
    console.log(ID);
    //this.Nav.navigate([]);
  }

  ngOnDestroy(): void {
    if(this.Listener != undefined)
      this.Listener.unsubscribe();
    this.ChatProcessor.SetIDSelected();
    this.AllMessage = [] ;
  }
}
