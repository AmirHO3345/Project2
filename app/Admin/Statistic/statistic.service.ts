import {Injectable} from "@angular/core";
import {FacilityModel} from "../../Data_Sharing/Model/Facility.model";
import {CustomerInfo, CustomerStatisticModel} from "../../Data_Sharing/Model/CustomerStatistic.model";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserModel} from "../../Data_Sharing/Model/user.model";
import {AuthenticationService} from "../../Windows_PopUp/Authentication/authentication.service";
import {map, take} from "rxjs";

interface CustomerPackageResponse {
  id : number ;
  name : string ;
  email : string ;
  rule : number ;
  amount : number ;
  profile : {
    id_user : number ,
    path_photo : string | null ,
    phone : number | null ,
    gender : string | null ,
    age : number | null ,
  } | null ;
}

interface CustomersPackageResponse {
  users : CustomerPackageResponse[] ;
  current_page : number ;
  url_next_page : string ;
  url_first_page : string ;
  url_last_page : string ;
  total_items : number ;
}

@Injectable({providedIn : 'root'})
export class StatisticService {

  FacilityStatistic !: FacilityModel ;
  CustomerStatistic !: CustomerStatisticModel ;
  AccountAdmin : UserModel | null ;
  PageInfo : {
    PageInfoUser : {
      Page : number ,
      IsDone : boolean
    } ,
    PageInfoOwner : {
      Page : number ,
      IsDone : boolean
    } ,
  } ;


  constructor(private HTTP : HttpClient , private AuthenticationInfo : AuthenticationService ) {
    this.AccountAdmin = null ;
    this.PageInfo = {
      PageInfoUser : {
        Page : 1 ,
        IsDone : false
      } ,
      PageInfoOwner : {
        Page : 1 ,
        IsDone : false
      }
    }
    this.StartService() ;
  }

  private StartService() {
    this.AuthenticationInfo.Account.subscribe(Value => {
      this.AccountAdmin = Value ;
    });
    this.FetchCustomerPackage(CustomerType.User).subscribe();
  }

  FetchCountAllCustomer(Type : CustomerType , SinceLastMonth : number) {
    let Params = new HttpParams().set('Since' , SinceLastMonth) ;
    Params = Params.append("rule" , Type.valueOf()) ;
    return this.HTTP.get<{numUsers: number}>(`${AuthenticationService.API_Location}api/admin/dashboard/user/count` ,
      {
      headers : new HttpHeaders({"Authorization" : 'Bearer 189|5ptwJImbHoa1gPwBJHc0UTzxui9dUWNLpNACYm24'}) ,
      params : Params
    }).pipe(take(1) , map(Value => {
      return Value.numUsers ;
    }));
  }

  FetchCountCustomerForget() {
    return this.HTTP.get<{numUsers: number}>(`${AuthenticationService.API_Location}api/admin/dashboard/user/logout` ,
      { headers : new HttpHeaders({"Authorization" : 'Bearer 189|5ptwJImbHoa1gPwBJHc0UTzxui9dUWNLpNACYm24'}) ,})
      .pipe(take(1) , map(Value => {
        return Value.numUsers ;
      }));
  }

  FetchCustomerPackage(Type : CustomerType) {
    let Params = new HttpParams().set("rule" , Type.valueOf()) ;
    return this.HTTP.get<CustomersPackageResponse>(`${AuthenticationService.API_Location}api/admin/dashboard/user/show` ,
      {
        headers : new HttpHeaders({"Authorization" : 'Bearer 189|5ptwJImbHoa1gPwBJHc0UTzxui9dUWNLpNACYm24'}) ,
        params : Params
      })
      .pipe(take(1) , map(ValueResponse => {
        let Result : CustomerInfo[] = [] ;
        ValueResponse.users.forEach(ValueCustomer => {
          let Temp : CustomerInfo = {
            ID : ValueCustomer.id ,
            CustomerName : ValueCustomer.name ,
            CustomerEmail : ValueCustomer.email ,
            Money : ValueCustomer.amount ,
          } ;
          if(ValueCustomer.profile != null) {
            Temp.SomeData = {
              Phone : (ValueCustomer.profile.phone != null) ? ValueCustomer.profile.phone : undefined ,
              Gender : (ValueCustomer.profile.gender != null) ? ValueCustomer.profile.gender : undefined ,
              Age : (ValueCustomer.profile.age != null) ? ValueCustomer.profile.age : undefined
            }
          }
        });
      }));
  }



}

enum CustomerType {
  User,
  Owner
}
