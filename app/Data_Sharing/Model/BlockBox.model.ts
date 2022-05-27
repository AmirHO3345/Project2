
export class BlockBoxData {

  public Image_Path : string ;
  public Sender_Name : string ;
  public Description : string ; // Or Message

  constructor(Type : boolean , Path : string , Name : string , desc : string) {
    this.Image_Path = Path ;
    this.Sender_Name = Name ;
    this.Description = desc;
  }

}
