
export class ReservationModel {

  readonly IdReservation : number ;

  readonly IdRoom : number ;

  readonly RoomName : string ;

  readonly ImagePath : string ;

  readonly DateFrom : Date ;

  readonly DateTo : Date ;

  readonly Cost : number ;

  private readonly CreateReservation : Date ;

  private ReservationStanding !: boolean ;

  constructor(IDRo : number , IDRe : number  , RN : string , IP : string ,
              DF : Date , DT : Date , C : number , CR : Date) {
    this.IdReservation = IDRe ;
    this.IdRoom = IDRo ;
    this.RoomName = RN ;
    this.ImagePath = IP ;
    this.DateFrom = DF ;
    this.DateTo = DT ;
    this.Cost = C ;
    this.CreateReservation = CR ;
    this.UpdateReservationStanding();
  }

  //View Cancel
  private UpdateReservationStanding() {
    let RangeDate = (+this.DateFrom - +this.CreateReservation)/(1000*60*60*24);
    if(RangeDate <= 1) {
      this.ReservationStanding = +new Date() < +this.DateFrom ;
    } else {
      let CreateShift = new Date(+this.CreateReservation + (1000*60*60*24));
      this.ReservationStanding = +CreateShift > (+new Date());
    }
  }

  IsReservationStanding() : boolean {
    this.UpdateReservationStanding();
    return this.ReservationStanding ;
  }

  ReservationsDay() : number {
    return (+this.DateTo - +this.DateFrom)/(1000*60*60*24);
  }
}
