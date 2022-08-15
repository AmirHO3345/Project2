export class UserModel {

  readonly ID : number ;
  readonly UserName : string ;
  readonly ImagePath : string ;
  private readonly IDToken : string ;
  private readonly Client_Type : Client ;

  constructor(id : number , Name : string , Token : string , Type : string , Path ?: string) {
    this.ID = id ;
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

  public GetToken() : string {

    return `Bearer ${this.IDToken}` ;
  }

  public GetType() : Client { return this.Client_Type ; }

  public Clone(Name ?: string , Token ?: string , Type ?: string , Path ?: string) : UserModel {
    let UN = (Name != undefined)? Name : this.UserName ;
    let IT = (Token != undefined)? Token : this.IDToken ;
    let CT = (Type != undefined)? Type : this.Client_Type.toString() ;
    let IP = (Path != undefined)? Path : this.ImagePath ;
    return new UserModel(this.ID , UN , IT , CT , IP) ;
  }

  public static Json2Object(DataJson : string) : UserModel {
    let UserModelObject : {
      id : number ;
      name : string ;
      path : string ;
      token : string ;
      clientType : number ;
    } = JSON.parse(DataJson) ;
    return new UserModel(UserModelObject.id , UserModelObject.name , UserModelObject.token ,
      UserModelObject.clientType.toString() , UserModelObject.path) ;
  }

  public static Object2Json(DataObject : UserModel) : string {
    return JSON.stringify({
      id : DataObject.ID ,
      name : DataObject.UserName ,
      path : DataObject.ImagePath ,
      token : DataObject.IDToken ,
      clientType : DataObject.Client_Type
    });
  }
}

export enum Client {
  User,
  Owner ,
  Admin
}
