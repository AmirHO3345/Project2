
export class CustomerStatisticModel {

  CountUser : number

  CountOwner : number ;

  CountCustomerForget : number ;

  DetailsCountUser !: {
    SinceLastMonth : number ,
    MonthDetails : {
      Month : string ,
      Amount : number
    }[]
  }

  DetailsCountOwner !: {
    SinceLastMonth : number ,
    MonthDetails : {
      Month : string ,
      Amount : number
    }[]
  }

  private UserInfo : CustomerInfo[] ;

  private OwnerInfo : CustomerInfo[] ;

  constructor(CU : number , CW : number , CCF : number, UI : CustomerInfo[]
              , OI : CustomerInfo[] ) {
    this.CountUser = CU ;
    this.CountOwner = CW ;
    this.CountCustomerForget = CCF ;
    this.UserInfo = UI ;
    this.OwnerInfo = OI ;
  }

  SetUserInfo(Items : CustomerInfo[]) {
    this.UserInfo = [] ;
    this.UserInfo.push(...Items) ;
  }

  SetOwnerInfo(Items : CustomerInfo[]) {
    this.OwnerInfo = [] ;
    this.OwnerInfo.push(...Items) ;
  }

  GetOwnerInfo() {
    return this.OwnerInfo.slice() ;
  }

  GetUserInfo() {
    return this.UserInfo.slice() ;
  }

  GetDetailsCount(Type : number) {
    /*
    1 : User ,
    2 : Owner
     */
    let Result : number[] = [] ;
    switch (Type) {
      case 1 :
        this.DetailsCountUser.MonthDetails.forEach(Value => Result.push(Value.Amount));
        break ;
      default :
        this.DetailsCountOwner.MonthDetails.forEach(Value => Result.push(Value.Amount));
        break ;
    }
    return Result ;
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
