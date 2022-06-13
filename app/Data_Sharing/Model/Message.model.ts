
export class MessageModel {

  readonly ID_Message : number ;

  readonly ID_Sender : number ;

  readonly ID_Receive : number ;

  readonly Message_Content : string ;

  readonly Message_Date : Date ;

  constructor( ID_M : number , ID_S : number , ID_R : number ,
               Message : string , Date_Send : Date) {
    this.ID_Message = ID_M ;
    this.ID_Sender = ID_S ;
    this.ID_Receive = ID_R ;
    this.Message_Content = Message ;
    this.Message_Date = Date_Send ;
  }
}
