import {Injectable} from "@angular/core";
import {NotificationModel, NotificationTypes} from "../Data_Sharing/Model/Notification.model";
import {UserModel} from "../Data_Sharing/Model/user.model";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";
import Pusher, {Channel} from "pusher-js";
import {BehaviorSubject, forkJoin, map, Observable, take} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

interface PusherResponse {
  id : string ,
  Notify_type : string ,
  header : string ,
  body : string ,
  created_at : string ,
  data ?: {
    url : string ,
    type : string ,
    body : {
      id_booking : number
    }
  }
}

interface NotificationResponse {
  Notifications : {
    id : string , //ID Notification
    type : string , //Trash
    notifiable_type : string , //Trash
    notifiable_id : number , // ID User
    data : {
      Notify_type : string , // UnBooking , Booking , Delete facility , Report
      header : string ,
      body : string ,
      created_at : string ,
      data ?: {
        url : string ,
        type : string ,
        body : {
          id_booking : number
        }
      } | []
    } ,
    read_at : string | null ,
    created_at : string ,
    updated_at : string
  }[];
  current_page : number;
  url_next_page: string | null ;
  url_first_page: string ;
  url_last_page: string ;
  total_items: number ;
}

interface UpdateStateService {
  Status : ServiceAvailable ;
  IsAnyUpdate : boolean ;
}

@Injectable({providedIn : 'root'})
export class NotificationService {

  private Notifications : NotificationModel[] ;
  private UserAccount : UserModel | null ;
  private PusherProcess !: Pusher ;
  private UserChannel !: Channel ;
  private PageInfo : {
    Page : number ,
    TotalItem : number ,
    IsDone : boolean
  }
  private UnReadNotification : number ;
  readonly UpdateState : BehaviorSubject<UpdateStateService> ;

  constructor(private AuthenticationInfo : AuthenticationService , private HTTP : HttpClient) {
    this.Notifications = [] ;
    this.PageInfo = {
      Page : 1 ,
      TotalItem : 0 ,
      IsDone : false
    }
    this.UnReadNotification = 0 ;
    this.UserAccount = null ;
    this.UpdateState = new BehaviorSubject<UpdateStateService>({
      Status : ServiceAvailable.NotAvailable ,
      IsAnyUpdate : false
    });
    this.StartService() ;
  }

  private StartService() {
    this.AuthenticationInfo.Account.subscribe((Value) => {
      if(Value != null) {
        this.UserAccount = Value ;
        this.GetUnReadNotification().subscribe(ValueUnRead => {
          this.UnReadNotification = ValueUnRead.count ;
          //this.InitialPusher(Value.ID);
          this.SendUpdate(ServiceAvailable.Available , false);
        });
      } else {
        this.SendUpdate(ServiceAvailable.NotAvailable , true);
        this.UserAccount = null ;
        this.Notifications = [] ;
        this.UnReadNotification = 0 ;
        this.PageInfo = {
          Page : 1 ,
          TotalItem : 0 ,
          IsDone : false
        };
        if(this.PusherProcess != undefined) {
          this.UserChannel.cancelSubscription();
          this.PusherProcess.disconnect() ;
        }
      }
    });
  }

  private InitialPusher(User_ID : number) {
    this.PusherProcess = new Pusher("98034be202413ea485fc" , {
      cluster : "ap2" ,
      authEndpoint : `${AuthenticationService.API_Location}api/broadcasting/auth` ,
      auth : {
        headers : {
          Authorization : this.UserAccount?.GetToken()
        }
      },
    }) ;
    this.UserChannel = this.PusherProcess.subscribe(`User.Notify.${User_ID}`);
    this.UserChannel.bind(`Illuminate\\Notifications\\Events\\BroadcastNotificationCreated`
      , (DataResponse : PusherResponse) => {
      let Info = this.ConvertFormat(DataResponse.Notify_type , DataResponse.id , DataResponse.created_at ,
        null , DataResponse.header , DataResponse.body ,
        (DataResponse.data != undefined)?DataResponse.data.body.id_booking:undefined) ;
      this.Notifications.unshift(Info);
      this.UnReadNotification++ ;
      this.SendUpdate(ServiceAvailable.Available , true);
    });
  }

  private GetUnReadNotification() {
    return this.HTTP.get<{count: number}>(`${AuthenticationService.API_Location}api/user/notifications/countRead` , {
      headers : new HttpHeaders({"Authorization" : (<UserModel>this.UserAccount).GetToken()}) ,
    });
  }

  private ConvertFormat(Notify_type : string , IdNotification : string , CreateDate : string ,
                        ReadDate : string | null , Header : string , Body : string ,
                        FacilityID ?: number) {
    let NotificationType !: NotificationTypes ;
    let Facility !: {FacilityID : number};
    switch (Notify_type) {
      case 'UnBooking' :
        NotificationType = NotificationTypes.ReservationCancel ;
        break ;
      case 'Booking' :
        NotificationType = NotificationTypes.ReservationDone ;
        if(FacilityID != undefined)
          Facility = {
            'FacilityID' : FacilityID
          };
        break ;
      case 'Report' :
        NotificationType = NotificationTypes.ReportFacility ;
        if(FacilityID != undefined)
          Facility = {
            'FacilityID' : FacilityID
          };
        break ;
      case 'Delete facility' :
        NotificationType = NotificationTypes.DeleteFacility ;
        break ;
      case 'Comment' :
        NotificationType = NotificationTypes.CommentFacility ;
        if(FacilityID != undefined)
          Facility = {
            'FacilityID' : FacilityID
          };
        break ;
    }
    return new NotificationModel(IdNotification , new Date(CreateDate) ,
      (ReadDate != null) , NotificationType ,
      {Title : Header , Body : Body} ,
      (Facility != undefined) ? Facility : undefined);
  }

  private SendUpdate(State : ServiceAvailable , AnyUpdate : boolean) {
    this.UpdateState.next({
      Status : State ,
      IsAnyUpdate : AnyUpdate
    });
  }

  private FetchPackageNotification(PageNeed : number) {
    let Params = new HttpParams().set('type' , 'All') ;
    Params = Params.append('page' , PageNeed) ;
    return this.HTTP.get<NotificationResponse>(`${AuthenticationService.API_Location}api/user/notifications`
      , {
      headers : new HttpHeaders({"Authorization" : "Bearer 186|i1sY0Lwb9KW6zVirCKNAhFpVW2eDNvqj1nJZFfXS"}) ,
      params : Params ,
    }).pipe(take(1) , map(Value => {
      console.log(Value);
          let NotificationBundle : NotificationModel[] = [] ;
          Value.Notifications.forEach(NotifyPart => {
            let DataFacilityID !: number ;
            if(!(NotifyPart.data.data instanceof (Array)) && NotifyPart.data.data != undefined)
              DataFacilityID = NotifyPart.data.data.body.id_booking
            let Info = this.ConvertFormat(NotifyPart.data.Notify_type , NotifyPart.id , NotifyPart.created_at ,
              NotifyPart.read_at , NotifyPart.data.header , NotifyPart.data.body ,
              DataFacilityID);
            NotificationBundle.push(Info);
          });
          this.PageInfo.TotalItem = Value.total_items ;
          this.PageInfo.IsDone = (Value.url_next_page == null) ;
          return NotificationBundle ;
      }));
  }

  public FetchNotificationList() {
    if(this.PageInfo.IsDone)
      return false ;
    this.SendUpdate(ServiceAvailable.NotAvailable , false);
    let ObservableList : Observable<NotificationModel[]>[] = [] ;
    if(this.PageInfo.Page % 1 == 0) {
      ObservableList.push(this.FetchPackageNotification(this.PageInfo.Page));
    }else {
      let Temp = Math.floor(this.PageInfo.Page) ;
      ObservableList.push(this.FetchPackageNotification(Temp));
      ObservableList.push(this.FetchPackageNotification(Temp + 1));
    }
    return forkJoin([...ObservableList]).pipe(take(1) , map((DataResponse) => {
      if(this.PageInfo.Page % 1 == 0) {
        this.Notifications.push(...DataResponse[0]);
        this.PageInfo.Page++ ;
      } else {
        let TempNum = ((this.PageInfo.Page % 1) * 10) - 1 ;
        DataResponse[0].forEach((Value , Index) => {
          if(Index > TempNum)
            this.Notifications.push(Value);
        });
        this.Notifications.push(...DataResponse[1]);
        this.PageInfo.Page = Math.floor(this.PageInfo.Page) + 2 ;
      }
      this.SendUpdate(ServiceAvailable.Available , true );
      return true ;
    }));
  }

  public CloseNotification() {
    return this.HTTP.post<any>(`${AuthenticationService.API_Location}api/user/notifications` , {
      type : 'update'} , {
      headers: new HttpHeaders({"Authorization": "Bearer 186|i1sY0Lwb9KW6zVirCKNAhFpVW2eDNvqj1nJZFfXS"}),
    }).pipe(take(1), map((Value) => {
      console.log(Value);
      for (let i = 0; i < this.Notifications.length ; i++) {
        if(this.Notifications[i].IsReading)
          break ;
        this.Notifications[i].IsReading = true ;
      }
      this.UnReadNotification = 0 ;
      return true ;
    }));
  }

  public GetNotificationList() {
    return this.Notifications.slice() ;
  }

  public GetPageInfo() {
    return {...this.PageInfo};
  }

  public GetUnReadNotify() {
    return this.UnReadNotification ;
  }
}

export enum ServiceAvailable {
  Available ,
  NotAvailable
}
