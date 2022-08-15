import {Injectable} from "@angular/core";
import {AuthenticationService} from "../../Windows_PopUp/Authentication/authentication.service";
import {Room_InformationModel, Room_Specification} from "../../Data_Sharing/Model/Room_Information.model";
import {BehaviorSubject, forkJoin, map, take} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface Facility {
  id: number ,
  id_user: number ,
  name: string ,
  location: string ,
  description: string ,
  type: string ,
  available: number ,
  cost: number ,
  rate: number ,
  num_guest: number,
  num_room: number,
  wifi: boolean ,
  coffee_machine: boolean ,
  air_condition: boolean,
  tv: boolean,
  fridge: boolean,
  created_at: string,
  updated_at: string,
  photos: {
    id_photo : number ,
    path_photo : string
  }[] ;
}

@Injectable({providedIn : 'root'})
export class contentService {

  private TopRateRoom : Room_InformationModel[] ;
  private TopSellRoom : Room_InformationModel[] ;
  readonly UpdateService : BehaviorSubject<ServiceAvailable> ;

  constructor(private HTTP : HttpClient) {
    this.TopRateRoom = [] ;
    this.TopSellRoom = [] ;
    this.UpdateService = new BehaviorSubject<ServiceAvailable>(
      ServiceAvailable.NotReady
    );
    this.StartService();
  }

  private StartService() {
    forkJoin([this.FetchTopRate() , this.FetchTopSell()])
      .pipe(take(1)).subscribe(Value => {
        this.TopRateRoom = Value[0] ;
        this.TopSellRoom = Value[1] ;
        this.UpdateService.next(ServiceAvailable.ReadyGetData);
    } , () => setTimeout(() => {
      this.StartService();
    } , 1000));
  }

  private FetchTopRate() {
    return this.HTTP.get<Facility[]>(`${AuthenticationService.API_Location}api/user/top5rate`)
      .pipe(take(1) , map(Value => {
      return this.Convert2FacilityArray(Value , 5) ;
    }));
  }

  private FetchTopSell() {
    return this.HTTP.get<Facility[]>(`${AuthenticationService.API_Location}api/user/mostbooked`)
      .pipe(take(1) , map(Value => {
      return this.Convert2FacilityArray(Value , 5) ;
    }));
  }

  private Convert2FacilityArray(Facilities : Facility[] , ItemWant : number) {
    let Result : Room_InformationModel[] = [] ;
    for (let i = 0 ; i < Facilities.length && i < ItemWant ; i++) {
      let Facility_Images : string[] = [] ;
      let Facility_Component : Room_Specification[] = [] ;
      Facilities[i].photos.forEach(ImageValue =>
        Facility_Images.push(`${AuthenticationService.API_Location}${ImageValue.path_photo}`)
      );
      {
        if(Facilities[i].tv)
          Facility_Component.push(Room_Specification.PLASMA_TV) ;
        if(Facilities[i].coffee_machine)
          Facility_Component.push(Room_Specification.Coffee_Machine) ;
        if(Facilities[i].air_condition)
          Facility_Component.push(Room_Specification.Air_Condition) ;
        if(Facilities[i].fridge)
          Facility_Component.push(Room_Specification.Fridge) ;
        if(Facilities[i].wifi)
          Facility_Component.push(Room_Specification.WIFI) ;
      }
      Result.push(new Room_InformationModel(Facilities[i].id , Facility_Images , Facilities[i].name ,
        Facilities[i].description , Facilities[i].cost , Facility_Component));
    }
    return Result ;
  }

  public GetData() {
    return {
      RateRoom : this.TopRateRoom.slice() ,
      SellRoom : this.TopSellRoom.slice()
    }
  }
}

export enum ServiceAvailable {
  ReadyGetData ,
  NotReady
}
