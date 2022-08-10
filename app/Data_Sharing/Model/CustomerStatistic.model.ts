
export class CustomerStatisticModel {

  readonly CountUser : number ;

  readonly CountOwner : number ;

  readonly CountCustomerForget : number ;

  readonly NewCustomer : {
    User : number ,
    Owner : number
  } ;

  private readonly UserInfo : CustomerInfo[] ;

  private readonly OwnerInfo : CustomerInfo[] ;

  constructor(CU : number , CW : number , CCF : number , NumUser : number , NumOwner : number,
              UI : CustomerInfo[] , OI : CustomerInfo[] ) {
    this.CountUser = CU ;
    this.CountOwner = CW ;
    this.CountCustomerForget = CCF ;
    this.NewCustomer = {
      User : NumUser ,
      Owner : NumOwner
    } ;
    this.UserInfo = UI ;
    this.OwnerInfo = OI ;
  }

  SetMoreUserInfo(Items : CustomerInfo[]) {
    Items.forEach(Value => this.UserInfo.push(Value));
  }

  SetMoreOwnerInfo(Items : CustomerInfo[]) {
    Items.forEach(Value => this.OwnerInfo.push(Value));
  }

  GetOwnerInfo() {
    return this.OwnerInfo.slice() ;
  }

  GetUserInfo() {
    return this.UserInfo.slice() ;
  }

}

export interface CustomerInfo {
  ID : number ;
  CustomerName : string ;
  CustomerEmail : string ;
  Money : number ;
  SomeData ?: {
    Phone ?: number ,
    Gender ?: string ,
    Age ?: number
  }
}
