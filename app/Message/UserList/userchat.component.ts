import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {MessageService, StateService} from "../message.service";
import {TimeService} from "../../Data_Sharing/Services/time.service";
import {ScrollTrackDirective} from "../../Data_Sharing/Directives/ScrollTrack.directive";

interface UserList {
  UserID : number ,
  UserName : string ,
  ImagePath : string ,
  IsActive : boolean ,
  LastMessage : string ,
  DateLastMessage : Date ,
  UnReadMessage : number
}

@Component({
  selector : 'app-user-chat' ,
  templateUrl : "./userchat.component.html",
  styleUrls : ['../../Data_Sharing/BootStraps/bootstrap400.css' , './userchat.component.css'
    , '../../Fonts/css/font-awesome.css']
})
export class UserChatComponent implements OnInit ,  AfterViewInit{

  @ViewChild('Scroller') ScrollControl !: ScrollTrackDirective ;
  Client_Info : UserList[] ;
  Current_Date : Date ; // Date Without Time
  MessageUnRead : number ;
  IsServiceAvailable : boolean ;
  IsDone : boolean ;

  constructor(private ChatProcessor : MessageService , private Timer : TimeService) {
    this.Client_Info = [] ;
    this.Current_Date = new Date();
    this.IsServiceAvailable = this.IsDone = false ;
    this.MessageUnRead = 0 ;
  }

  ngOnInit(): void {
    this.Timer.UpdateTime.subscribe((Value) => this.Current_Date = Value) ;
    this.ChatProcessor.UpdateState.subscribe((Value) => {
      switch (Value.Status) {
        case StateService.Loading :
          this.IsServiceAvailable = false ;
          break ;
        case StateService.NoUpdate :
          this.IsServiceAvailable = true ;
          break ;
        case StateService.UsersUpdate :
          this.Client_Info = this.ChatProcessor.GetUserView();
          this.MessageUnRead = this.ChatProcessor.GetUnReadMessage();
          this.IsServiceAvailable = true ;
          break ;
        case StateService.ActiveUpdate :
          if(Value.Active == undefined)
            return;
          this.Client_Info[Value.Active.FetchIndex].IsActive
            = Value.Active.Active ;
          this.IsServiceAvailable = true ;
          break ;
      }
      this.IsDone = Value.ServiceInfo.IsDone ;
    });
  }

  ngAfterViewInit(): void {
    let Temp = setInterval(() => {
      if(this.IsServiceAvailable) {
        clearInterval(Temp);
        if(this.IsDone)
          this.Client_Info = this.ChatProcessor.GetUserView();
        else
          this.ChatProcessor.FetchPackageUser(10);
        this.ScrollControl.Scroller_Info.subscribe((ScrollData) => {
          if(this.ScrollControl.AccessEnd()) {
            if(this.IsServiceAvailable && !this.IsDone)
              this.ChatProcessor.FetchPackageUser(10);
          }
        });
      }
    } , 1000) ;
  }
}
