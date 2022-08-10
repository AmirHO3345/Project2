import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationService, ServiceAvailable} from "./notification.service";
import {NotificationModel, NotificationTypes} from "../Data_Sharing/Model/Notification.model";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ScrollTrackDirective} from "../Data_Sharing/Directives/ScrollTrack.directive";
import {TimeService} from "../Data_Sharing/Services/time.service";

@Component({
  selector : 'app-notification' ,
  templateUrl : "./notification.component.html",
  styleUrls : ['./notification.component.css']
})
export class NotificationComponent implements OnInit , AfterViewInit ,  OnDestroy{

  @ViewChild('Scroller') ScrollControl !: ScrollTrackDirective ;
  Notifications : NotificationModel[] ;
  CurrentTime : Date ;
  UnReadNotification !: number ;
  IsServeAvailable : boolean ;
  IsDone : boolean ;
  RunScroll : boolean ;
  LinkUpdateState !: Subscription ;
  LinkTimer !: Subscription ;

  constructor(private NotificationProcessor : NotificationService ,
              private route : Router , private Timer : TimeService) {
    this.Notifications = [] ;
    this.CurrentTime = new Date();
    this.IsServeAvailable = false ;
    this.IsDone = false ;
    this.RunScroll = false ;
  }

  ngOnInit(): void {
    this.LinkUpdateState = this.NotificationProcessor.UpdateState.subscribe(Value => {
      this.IsServeAvailable = (Value.Status == ServiceAvailable.Available) ;
      if(this.UnReadNotification == undefined && this.IsServeAvailable) {
        this.UnReadNotification = this.NotificationProcessor.GetUnReadNotify() ;
        this.IsDone = this.NotificationProcessor.GetPageInfo().IsDone ;
        this.Notifications = this.NotificationProcessor.GetNotificationList();
        if(this.Notifications.length == 0 && !this.IsDone) {
            let Temp = this.NotificationProcessor.FetchNotificationList() ;
            if(Temp instanceof Observable)
              Temp.subscribe(() => this.RunScroll = true);
          } else
              this.RunScroll = true ;
      } else if(Value.IsAnyUpdate) {
        this.Notifications = this.NotificationProcessor.GetNotificationList() ;
        this.IsDone = this.NotificationProcessor.GetPageInfo().IsDone ;
        this.RunScroll = true ;
      }
    }) ;
    this.LinkTimer = this.Timer.UpdateTime.subscribe(Value => this.CurrentTime = Value) ;
  }

  ngAfterViewInit(): void {
    this.ScrollControl.Scroller_Info.subscribe(() => {
      if(this.RunScroll && !this.IsDone &&
        this.ScrollControl.AccessEnd(0.09)) {
        this.RunScroll = false ;
        let Temp = this.NotificationProcessor.FetchNotificationList() ;
        if(Temp instanceof Observable)
          Temp.subscribe();
      }
    });
  }

  GetImagePath(Type : NotificationTypes) : string {
    switch (Type) {
      case NotificationTypes.CommentFacility:
        return 'assets/Images/Comment.png';
      case NotificationTypes.DeleteFacility:
        return 'assets/Images/Delete.png';
      case NotificationTypes.ReportFacility:
        return 'assets/Images/Report.png';
      case NotificationTypes.ReservationCancel:
        return 'assets/Images/Cancel.png';
      case NotificationTypes.ReservationDone:
        return 'assets/Images/Done.png';
      default:
        return '';
    }
  }

  OnDetails(NotificationItem : NotificationModel) {
    if(!NotificationItem.RouteDirection.IsThere)
      return ;
    this.route.navigate(['room-detail/' , NotificationItem.RouteDirection.FacilityID]);
  }

  ngOnDestroy(): void {
    if(this.LinkUpdateState != undefined)
      this.LinkUpdateState.unsubscribe();
    if(this.LinkTimer)
      this.LinkTimer.unsubscribe();
    this.Notifications = [] ;
    this.NotificationProcessor.CloseNotification().subscribe();
  }
}

/*
if this list open then the Notification Header must be vanish
 */
