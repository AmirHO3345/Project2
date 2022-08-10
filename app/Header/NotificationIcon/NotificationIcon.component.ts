import {Component, ViewChild} from "@angular/core";
import {ScrollTrackDirective} from "../../Data_Sharing/Directives/ScrollTrack.directive";
import {NotificationModel, NotificationTypes} from "../../Data_Sharing/Model/Notification.model";
import {Observable, Subscription} from "rxjs";
import {NotificationService, ServiceAvailable} from "../../Notification/notification.service";
import {Router} from "@angular/router";
import {TimeService} from "../../Data_Sharing/Services/time.service";

@Component({
  selector: 'app-notification-icon',
  templateUrl: './NotificationIcon.component.html',
  styleUrls: ['../Header.component.css']
})
export class NotificationIconComponent {

  @ViewChild('Scroller') ScrollControl !: ScrollTrackDirective ;
  Notifications : NotificationModel[] ;
  CurrentTime : Date ;
  UnReadNotification !: number ;
  IsServeAvailable : boolean ;
  IsDone : boolean ;
  RunScroll : boolean ;
  IsOpen : boolean ;
  LinkUpdateState !: Subscription ;
  LinkTimer !: Subscription ;

  constructor(private NotificationProcessor : NotificationService ,
              private route : Router , private Timer : TimeService) {
    this.Notifications = [] ;
    this.CurrentTime = new Date();
    this.IsServeAvailable = false ;
    this.IsDone = false ;
    this.RunScroll = false ;
    this.IsOpen = false ;
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
        if(!this.IsOpen)
          this.UnReadNotification++ ;
      }
    }) ;
    this.LinkTimer = this.Timer.UpdateTime.subscribe(Value => this.CurrentTime = Value) ;
  }

  DropDownNotification() {
    this.IsOpen = !this.IsOpen ;
    if(this.IsOpen)
      this.UnReadNotification = 0 ;
    else
      this.NotificationProcessor.CloseNotification().subscribe();
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
  }

}
