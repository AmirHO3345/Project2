
export class Room_InformationModel {

  Facility_Images : string[] ;
  Facility_Name : string ;
  Facility_Description : string;
  Facility_Price : number ;
  Facility_Component : Room_Specification[]


  public constructor(FI : string[] , FN : string , FD : string , FP : number , FC : Room_Specification[]) {
    this.Facility_Images = FI;
    this.Facility_Name = FN;
    this.Facility_Description = FD;
    this.Facility_Price = FP;
    this.Facility_Component = FC;
  }

}

export enum Room_Specification {
  BED ,
  SHOWER,
  PLASMA_TV,
  BATHTUB,
  SAFE_BOX,
  GARDEN
}
