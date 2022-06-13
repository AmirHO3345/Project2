
export class ConsigneeDataModel {

  readonly UserID : number ;

  readonly UserName : string ;

  private readonly ImagePath : string ;

  IsActive : boolean ;

  LastMessage !: string ;

  DateLastMessage !: Date ;

  UnReadMessage : number ;

  constructor(ID : number ,IP : string , UN : string , Active : boolean , URM ?: number
              , LM ?: string , DLM ?: Date) {
    this.UserID = ID ;
    this.ImagePath = IP ;
    this.UserName = UN ;
    this.IsActive = Active ;
    this.UnReadMessage = (URM != undefined)? URM : 0 ;
    if(LM != undefined)
      this.LastMessage = LM ;
    if(DLM != undefined)
      this.DateLastMessage = DLM ;
  }
}
