
export class NotificationModel {

  readonly IdNotification : string ;

  readonly NotificationFormat : NotificationTypes ;

  readonly Creation_Date : Date ;

  readonly NotificationData : {
    Title : string ,
    Body : string ,
  } ;

  readonly RouteDirection : {
    IsThere : boolean ,
    FacilityID ?: number
  } ;

  IsReading : boolean ;

  constructor(    IN : string , CD : Date , IR : boolean
                , NF : NotificationTypes , ND : {Title : string , Body : string } ,
                  DR ?: {FacilityID : number} ) {
    this.IdNotification = IN ;
    this.Creation_Date = CD ;
    this.IsReading = IR ;
    this.NotificationFormat = NF ;
    this.NotificationData = ND ;
    if(DR != undefined)
      this.RouteDirection = {
        IsThere : true ,
        FacilityID : DR.FacilityID
      };
    else
      this.RouteDirection = {
        IsThere : false
      };
  }
}

export enum NotificationTypes {
  ReservationDone ,
  ReservationCancel ,
  ReportFacility,
  CommentFacility,
  DeleteFacility
}
