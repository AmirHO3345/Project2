import {MessageModel} from "./Message.model";

export class ConsigneeDataModel {

  readonly UserID : number ;

  readonly UserName : string ;

  readonly ImagePath : string ;

  private readonly Messages : { Page : number , Message : MessageModel[] , Done : boolean };

  IsActive : boolean ;

  LastMessage !: string ;

  DateLastMessage !: Date ;

  UnReadMessage : number ;

  constructor(ID : number ,IP : string , UN : string , Active : boolean , URM ?: number
              , LM ?: string , DLM ?: Date) {
    this.UserID = ID ;
    this.ImagePath = IP ;
    this.Messages = {
      Page : 1 ,
      Message : [] ,
      Done : false
    } ;
    this.UserName = UN ;
    this.IsActive = Active ;
    this.UnReadMessage = (URM != undefined)? URM : 0 ;
    if(LM != undefined)
      this.LastMessage = LM ;
    if(DLM != undefined)
      this.DateLastMessage = DLM ;
  }

  SetMessageList(MessageSet : MessageModel[] , IsDone  = false ) {
    this.Messages.Message.unshift(...MessageSet.reverse()) ;
    this.Messages.Page = (this.Messages.Message.length / 10) + 1 ;
    this.Messages.Done = IsDone ;
  }

  ReceiveMessage(MessageSet : MessageModel) {
    this.LastMessage = MessageSet.Message_Content ;
    this.DateLastMessage = MessageSet.Message_Date ;
    this.Messages.Message.push(MessageSet);
    this.Messages.Page = (this.Messages.Message.length / 10) + 1 ;
  }

  GetInfoMessages() {
    return {
      Page : this.Messages.Page ,
      Done : this.Messages.Done
    };
  }

  GetAllMessage() {
    return this.Messages.Message.slice() ;
  }
}
