
export class Room_InformationModel {

  readonly Facility_ID : number ;

  readonly Facility_Name : string ;

  readonly Facility_Images : string[] ;

  readonly Facility_Description : string;

  readonly Facility_Price : number ;

  readonly Facility_Component : Room_Specification[];

  public constructor(ID : number , FI : string[] , FN : string ,
                     FD : string , FP : number , FC : Room_Specification[]) {
    this.Facility_ID = ID ;
    this.Facility_Images = FI;
    this.Facility_Name = FN;
    this.Facility_Description = FD;
    this.Facility_Price = FP;
    this.Facility_Component = FC;
  }

}

export enum Room_Specification {
  WIFI,
  Coffee_Machine,
  PLASMA_TV,
  Air_Condition,
  Fridge
}
