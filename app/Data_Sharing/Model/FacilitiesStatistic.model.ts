
export interface FacilityInfo {
  ID : number ;
  ID_Owner : number ;
  Name : string ;
  Location : string ;
  Description : string ;
  Type : string ;
  Available : boolean ;
  Cost : number ;
  Rate : number ;
  Created_at : Date ,
  Updated_at : Date ,
}

export class FacilityStatisticModel {

  readonly CountFacilities : number ;

  readonly CountBooking : number ;

  readonly CostBookings : number ;

  DetailsCountFacilities !: {
    SinceLastMonth : number ,
    MonthDetails : {
      Month : string ,
      Amount : number
    }[]
  } ;

  DetailsCountBooking !: {
    SinceLastMonth : number ,
    MonthDetails : {
      Month : string ,
      Amount : number
    }[]
  } ;

  DetailsCostBooking !: {
    SinceLastMonth : number ,
    MonthDetails : {
      Month : string ,
      Amount : number
    }[]
  } ;

  FacilityInfo : FacilityInfo[] ;

  constructor(CF : number , CountB : number , CostB : number , FI ?: FacilityInfo[]) {
    this.CountFacilities = CF ;
    this.CountBooking = CountB ;
    this.CostBookings = CostB ;
    if(FI != undefined)
      this.FacilityInfo = FI ;
    else
      this.FacilityInfo = [] ;
  }

  SetFacilityInfo(Items : FacilityInfo[]) {
    this.FacilityInfo = [] ;
    this.FacilityInfo.push(...Items) ;
  }

  GetFacilityInfo() {
    return this.FacilityInfo.slice() ;
  }

  GetDetailsCount(Type : number) {
    /*
    1 : Facility ,
    2 : Count Booking ,
    3 : Cost Booking
     */
    let Result : number[] = [] ;
    switch (Type) {
      case 1 :
        this.DetailsCountFacilities.MonthDetails.forEach(Value => Result.push(Value.Amount));
        break ;
      case 2 :
        this.DetailsCountBooking.MonthDetails.forEach(Value => Result.push(Value.Amount));
        break ;
      default :
        this.DetailsCostBooking.MonthDetails.forEach(Value => Result.push(Value.Amount));
        break ;
    }
    return Result ;
  }
}

