
export class FacilityModel {

  readonly CountFacilities : number ;

  readonly PercentIncrease : number ;

  readonly SinceFacility : number ;

  readonly CountBooking : number ;

  readonly CostBookings : number ;

  readonly DetailsMonthBooking : number[] ;

  readonly DetailsMonthCost : number[] ;

  constructor(CF : number , PI : number , SF : number , CountB : number ,
              CostB : number , DMB : number[] , DMC : number[] ) {
    this.CountFacilities = CF ;
    this.PercentIncrease = PI ;
    this.SinceFacility = SF ;
    this.CountBooking = CountB ;
    this.CostBookings = CostB ;
    this.DetailsMonthBooking = DMB ;
    this.DetailsMonthCost = DMC ;
  }
}
