
export class UserModel {

  readonly UserName : string ;
  readonly ImagePath : string ;
  private readonly IDToken : string ;
  private readonly Client_Type : Client ;

  constructor(Name : string , Token : string , Type : string , Path ?: string) {
    this.UserName = Name;
    this.IDToken = Token;
    this.Client_Type = UserModel.Convert2Client(Type);

    if(Path == undefined)
      this.ImagePath = 'assets/Images/avatar1.jpg';
    else
      this.ImagePath = Path;
  }

  private static Convert2Client(Type : String) : Client {

    let Temp : Client ;

    if(+Type == 0)
      Temp = Client.User;
    else if(+Type == 1)
      Temp = Client.Owner;
    else
      Temp = Client.Admin;

    return Temp;
  }

  public GetToken() : string { return `Bearer ${this.IDToken}` ; }

  public GetType() : Client { return this.Client_Type ; }

  public Clone(Name ?: string , Token ?: string , Type ?: string , Path ?: string) : UserModel {
    let UN = (Name != undefined)? Name : this.UserName ;
    let IT = (Token != undefined)? Token : this.IDToken ;
    let CT = (Type != undefined)? Type : this.Client_Type.toString() ;
    let IP = (Path != undefined)? Path : this.ImagePath ;
    return new UserModel(UN , IT , CT , IP) ;
  }

}

export enum Client {
  User,
  Owner ,
  Admin
}
