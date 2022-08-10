import {Injectable} from "@angular/core";
import {ReservationModel} from "../Data_Sharing/Model/Reservation.model";
import {UserModel} from "../Data_Sharing/Model/user.model";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {take, map, Observable} from "rxjs";

interface ResponseReservations {
  infoBookings : {
    id: number,
    id_facility: number,
    id_user: number,
    cost: number,
    start_date: string,
    end_date: string,
    created_at: string,
    name: string,
    path_photo: string
  }[];
   current_page : number ;
   url_next_page : number | null ;
   url_first_page : string ;
   url_last_page : string ;
   total_items : number ;
   total_pages : number ;
}

@Injectable({providedIn : 'root'})
export class ReservationListService {

  private Account !: UserModel ;
  private Page : number ;
  private TotalPage : number ;
  private TotalItem : number ;
  private IsGoToBack : boolean ;
  readonly ItemsOfPage : number ; // Number Of Items in One Page
  readonly PagesOfPart : number ; // Number Of Page in each part of Pagination list

  constructor(private HTTP : HttpClient , private AuthenticationInfo : AuthenticationService) {
    this.AuthenticationInfo.Account.subscribe((Value) => {
      if(Value != null)
        this.Account = Value ;
    });
    this.Page = 1 ;
    this.TotalPage = 1 ;
    this.TotalItem = 0 ;
    this.ItemsOfPage = 8 ;
    this.PagesOfPart = 5 ;
    this.IsGoToBack = false ;
  }

  GetReservationsInfo(Page : number) : Observable<ReservationModel[]> {
    let Params = new HttpParams().set("page" , Page);
    Params = Params.append('num_values' , this.ItemsOfPage);
    return this.HTTP.get<ResponseReservations>(`${AuthenticationService.API_Location}api/bookings/show` , {
      headers : new HttpHeaders({"Authorization" : "Bearer 71|2Sto50YqvEiedvp3qv819aPfZSdikUwM8pOJKAhD"}) ,
      params : Params
    }).pipe(take(1), map(Value => {
        let Temp: ReservationModel[] = [];
        Value.infoBookings.forEach(Item => {
          Temp.push(new ReservationModel(Item.id_facility , Item.id
            , Item.name, Item.path_photo, new Date(Item.start_date)
            , new Date(Item.end_date), Item.cost , new Date(Item.created_at)));
        });
        this.TotalPage = Value.total_pages;
        this.TotalItem = Value.total_items ;
        this.Page = Page ;
        this.IsGoToBack = true ;
        return Temp;
      }
    ));
  }

  SendCancelReservation(Item : ReservationModel) : Observable<boolean> {
    let Params = new HttpParams().set("id_booking" ,  Item.IdReservation);
    Params = Params.append("id_facility" , Item.IdRoom);
    return this.HTTP.delete(`${AuthenticationService.API_Location}api/bookings/unbooking` , {
      headers : new HttpHeaders({"Authorization" : "Bearer 71|2Sto50YqvEiedvp3qv819aPfZSdikUwM8pOJKAhD"}) ,
      params : Params
    }).pipe(take(1) , map((Value) => {
      console.log(Value);
      return !(Value instanceof HttpErrorResponse);
    }));
  }

  GetPageInfo()  {
    return {
      CurrentPage : this.Page ,
      TotalPage : this.TotalPage ,
      TotalItems : this.TotalItem
    };
  }

  IsCallBackEnd() {
    return this.IsGoToBack ;
  }
}
