
export class UserModel {

  private readonly UserName : string ;
  private readonly ImagePath : string ;
  private readonly IDToken : string ;
  private readonly Client_Type : string ;

  constructor(Name : string , Path : string , Token : string ) {
    this.UserName = Name;
    this.ImagePath = Path;
    this.IDToken = Token;
    this.Client_Type = "User";
  }

  public GetName() : string { return this.UserName ; }

  public GetImage() : string { return this.ImagePath ; }

  public GetToken() : string { return `Bearer ${this.IDToken}` ; }

  public GetType() : string { return this.Client_Type ; }

}
