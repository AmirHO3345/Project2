import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {ScrollTrackDirective} from "../../Data_Sharing/Directives/ScrollTrack.directive";
import {MessageService, ServiceAction, ServiceAvailable} from "../../Message/message.service";
import {TimeService} from "../../Data_Sharing/Services/time.service";
import {Router} from "@angular/router";

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
  selector: 'app-message-icon',
  templateUrl: './MessageIcon.component.html',
  styleUrls: ['../Header.component.css']
})
export class MessageIconComponent implements OnInit , AfterViewInit{

  @ViewChild('Scroller') ScrollControl !: ScrollTrackDirective ;
  Client_Info : UserList[] ;
  Current_Date : Date ; // Date Without Time
  MessageUnRead : number ;
  IsServiceAvailable : boolean ;
  IsDone : boolean ;

  constructor(private ChatProcessor : MessageService , private Timer : TimeService ,
              private route : Router) {
    this.Client_Info = [] ;
    this.Current_Date = new Date();
    this.IsServiceAvailable = this.IsDone = false ;
    this.MessageUnRead = 0 ;
  }

  ngOnInit(): void {
    this.Timer.UpdateTime.subscribe((Value) => this.Current_Date = Value) ;
    this.ChatProcessor.UpdateState.subscribe((Value) => {
      switch (Value.Status) {
        case ServiceAvailable.NotAvailable :
          this.IsServiceAvailable = false ;
          break;
        case ServiceAvailable.Available :
          switch (Value.Action) {
            case ServiceAction.ActiveUpdate :
              if(Value.ActiveUpdate == undefined)
                return;
              this.Client_Info[Value.ActiveUpdate.FetchIndex].IsActive
                = Value.ActiveUpdate.Active ;
              this.IsServiceAvailable = true ;
              break ;
            case ServiceAction.UsersUpdate :
              this.Client_Info = this.ChatProcessor.GetUserView();
              this.MessageUnRead = this.ChatProcessor.GetUnReadMessage();
              this.IsServiceAvailable = true ;
              break ;
            default :
              this.IsServiceAvailable = true ;
              break ;
          }
          break;
      }
      this.IsDone = Value.ServiceInfo.IsDone ;
    });
  }

  ngAfterViewInit(): void {
    let Temp = setInterval(() => {
      if(this.IsServiceAvailable) {
        clearInterval(Temp);
        this.Client_Info = this.ChatProcessor.GetUserView();
        if(this.Client_Info.length == 0 && !this.IsDone)
          this.ChatProcessor.FetchPackageUser(10);
        this.ScrollControl.Scroller_Info.subscribe((ScrollData) => {
          if(this.ScrollControl.AccessEnd(0.08)) {
            if(this.IsServiceAvailable && !this.IsDone)
              this.ChatProcessor.FetchPackageUser(10);
          }
        });
      }
    } , 1000) ;
  }

  Navigate2Chat(Item : UserList) {
    this.route.navigate(['/chat' , Item.UserID]);
  }
}
