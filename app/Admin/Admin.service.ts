import {Injectable} from "@angular/core";
import {CustomerInfo} from "../Data_Sharing/Model/CustomerStatistic.model";
import {FacilityInfo, FacilityStatisticModel} from "../Data_Sharing/Model/FacilitiesStatistic.model";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserModel} from "../Data_Sharing/Model/user.model";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";
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
  url_next_page : string | null ;
  url_first_page : string ;
  url_last_page : string ;
  total_pages : number
  total_items : number ;
}

interface FacilityInfoResponse {
  data : {
    avgcost : number ,
    avgrateNeg : number ,
    countfacall : number ,
    countbookings : number ,
    costbookings : number ,
    countcancelbooking : number ,
    countbookings5lastmonth : {
      [MonthName : string] : number
    },
    costbookings5lastmonth: {
      [MonthName : string] : number
    }
  }
}

interface FacilityDataResponse {
   id : number ,
   id_user : number ,
   name : string,
   location : string,
   description : string,
   type : string,
   available : number ,
   cost : number ,
   rate : number ,
   num_guest : number ,
   num_room : number ,
   wifi : number ,
   coffee_machine : number ,
   air_condition : number ,
   tv : number ,
   fridge : number ,
   created_at : string ,
   updated_at : string ,
   photos : []
}

interface FacilityPackageResponse {
  facilities : FacilityDataResponse[] ;
  current_page : number ,
  url_next_page: string | null ,
  url_first_page: string  ,
  url_last_page: string ,
  total_pages: number ,
  total_items: number
}

interface CountFacilityResponse {
  users : {
    [MonthName : string] : number
  },
  owners : {
    [MonthName : string] : number
  },
  facilities : {
    [MonthName : string] : number
  }
}

@Injectable({providedIn : 'root'})
export class AdminService {

  private AccountAdmin : UserModel | null ;

  constructor(private HTTP : HttpClient , private AuthenticationInfo : AuthenticationService ) {
    this.AccountAdmin = null ;
    this.StartService() ;
  }

  private StartService() {
    this.AuthenticationInfo.Account.subscribe(Value => {
      this.AccountAdmin = Value ;
      //StartService
    });
  }

  public FetchCountCustomerForget() {
    return this.HTTP.get<{numUsers: number}>(`${AuthenticationService.API_Location}api/admin/dashboard/user/logout` ,
      { headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()})})
      .pipe(take(1) , map(Value => {
        return Value.numUsers ;
      }));
  }

  public FetchFacilityData() {
    return this.HTTP.get<FacilityInfoResponse>(`${AuthenticationService.API_Location}api/admin/dashboard/data ` ,
      {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
      }).pipe(take(1) , map(Value => {
      let DetailsMonthBooking = [] ;
      let DetailsMonthCost = [] ;
      for (const ValueKey in Value.data.countbookings5lastmonth)
        DetailsMonthBooking.push({
          Month : ValueKey ,
          Amount : Value.data.countbookings5lastmonth[ValueKey]
        }) ;
      for (const ValueKey in Value.data.costbookings5lastmonth)
        DetailsMonthCost.push({
          Month : ValueKey ,
          Amount : Value.data.costbookings5lastmonth[ValueKey]
        }) ;
      let FacilityData = new FacilityStatisticModel(Value.data.countfacall , Value.data.countbookings ,
        Value.data.costbookings) ;
      FacilityData.DetailsCostBooking = {
        SinceLastMonth : 5 ,
        MonthDetails : DetailsMonthCost
      } ;
      FacilityData.DetailsCountBooking = {
        SinceLastMonth : 5 ,
        MonthDetails : DetailsMonthBooking
      } ;
      return FacilityData ;
    }));
  }

  public FetchInfoSinceLastMonth(SinceLastMonth : number) {
    let Params = new HttpParams().set('num' , SinceLastMonth) ;
    return this.HTTP.get<CountFacilityResponse>(`${AuthenticationService.API_Location}api/admin/dashboard/count/all` ,
      {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
        params : Params
      }).pipe(take(1) , map(Value => {
      let User = []
        , Owner  = []
        , Facility  = [] ;
      for (const userKey in Value.users)
        User.push({
          Month : userKey ,
          Amount : Value.users[userKey]
        }) ;
      for (const ownerKey in Value.owners)
        Owner.push({
          Month : ownerKey ,
          Amount : Value.owners[ownerKey]
        }) ;
      for (const facilityKey in Value.facilities)
        Facility.push({
          Month : facilityKey ,
          Amount : Value.facilities[facilityKey]
        }) ;
      return {
        User : User ,
        Owner : Owner ,
        Facility : Facility
      } ;
    }));
  }

  public FetchCountAllCustomer(Type : CustomerType) {
    let Params = new HttpParams().set("rule" , Type.valueOf()) ;
    return this.HTTP.get<{numUsers: number}>(`${AuthenticationService.API_Location}api/admin/dashboard/user/count` ,
      {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
        params : Params
      }).pipe(take(1) , map(Value => {
      return Value.numUsers ;
    }));
  }

  public FetchCustomerList(Type : CustomerType , Page : number) {
    let Params = new HttpParams().set("page" , Page);
    Params = Params.append("rule" , Type) ;
    return this.HTTP.get<CustomersPackageResponse>(`${AuthenticationService.API_Location}api/admin/dashboard/user/show` ,
      { headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
        params : Params }).pipe(take(1), map(ValueResponse => {
      let DataResult : CustomerInfo[] = [] ;
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
        DataResult.push(Temp);
      });
      let PageResponse =  {
          CurrentPage : ValueResponse.current_page ,
          TotalPage : ValueResponse.total_pages ,
          IsSearchData : false
      };
      return {
        Result : DataResult ,
        PageInfo : PageResponse
      } ;
    }));
  }

  public FetchFacilityList(Page : number) {
    let Params = new HttpParams().set("page" , Page);
    return this.HTTP.get<FacilityPackageResponse>(`${AuthenticationService.API_Location}api/facilities/search` ,
      {params : Params}).pipe(take(1), map(ValueResponse => {
        let DataResult : FacilityInfo[] = [] ;
        ValueResponse.facilities.forEach(ValueFacility => {
          let Temp : FacilityInfo = {
            ID : ValueFacility.id ,
            ID_Owner : ValueFacility.id_user ,
            Name : ValueFacility.name ,
            Location : ValueFacility.location ,
            Description : ValueFacility.description ,
            Type : ValueFacility.type ,
            Available : (ValueFacility.available == 1) ,
            Cost : ValueFacility.cost ,
            Rate : ValueFacility.rate ,
            Created_at : new Date(ValueFacility.created_at) ,
            Updated_at : new Date(ValueFacility.updated_at) ,
          } ;
          DataResult.push(Temp);
        });
        let PageResponse =  {
        CurrentPage : ValueResponse.current_page ,
        TotalPage : ValueResponse.total_pages ,
        IsSearchData : false
      };
        return {
          Result : DataResult ,
          PageInfo : PageResponse
        } ;
    }));
  }

  public DeleteCustomer(ID : number) {
    return this.HTTP.delete(`${AuthenticationService.API_Location}api/admin/dashboard/user/delete` ,
      {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
        params : new HttpParams().set("id" , ID)
      }).pipe(take(1) , map(Value => {
      return !(Value instanceof HttpErrorResponse) ;
    }));
  }

  public DeleteFacility(ID : number) {
    return this.HTTP.delete<any>(`${AuthenticationService.API_Location}api/facility/delete/${ID}` ,
      {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()})
      }).pipe(take(1) , map(Value => {
      return !(Value instanceof HttpErrorResponse) ;
    }));
  }

  public SearchCustomer(Name : string , Type : CustomerType , Page : number ) {
    let Params = new HttpParams().set("name" , Name);
    Params = Params.append("rule" , Type);
    Params = Params.append("page" , Page);
    return this.HTTP.get<CustomersPackageResponse>(`${AuthenticationService.API_Location}api/admin/dashboard/user/search` ,
      {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
        params : Params
      }).pipe(take(1) , map(Value => {
        let DataResult : CustomerInfo[] = [] ;
        Value.users.forEach(ValueCustomer => {
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
          DataResult.push(Temp);
        });
        let PageResponse =  {
          CurrentPage : Value.current_page ,
          TotalPage : Value.total_pages ,
          IsSearchData : true
        };
        return {
          Result : DataResult ,
          PageInfo : PageResponse
        } ;
      }));
  }

  public SearchFacility(Name : string , Page : number) {
    let Params = new HttpParams().set("name" , Name);
    Params = Params.append("page" , Page) ;
    return this.HTTP.get<FacilityPackageResponse>(`${AuthenticationService.API_Location}api/facilities/search` , {
        headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()}) ,
        params : Params
      }).pipe(take(1) , map(Value => {
      let DataResult : FacilityInfo[] = [] ;
      Value.facilities.forEach(ValueFacility => {
        let Temp : FacilityInfo = {
          ID : ValueFacility.id ,
          ID_Owner : ValueFacility.id_user ,
          Name : ValueFacility.name ,
          Location : ValueFacility.location ,
          Description : ValueFacility.description ,
          Type : ValueFacility.type ,
          Available : (ValueFacility.available == 1) ,
          Cost : ValueFacility.cost ,
          Rate : ValueFacility.rate ,
          Created_at : new Date(ValueFacility.created_at) ,
          Updated_at : new Date(ValueFacility.updated_at) ,
        } ;
        DataResult.push(Temp);
      });
      let PageResponse =  {
        CurrentPage : Value.current_page ,
        TotalPage : Value.total_pages ,
        IsSearchData : true
      };
      return {
        Result : DataResult ,
        PageInfo : PageResponse
      } ;
    }));
  }

  public static CalculateRelativePoints(Statistic : {
    Month : string ,
    Amount : number
  }[]) {
    /*
    Calcue all point without multiple 100 then calcue avg all point then * 100
     */
    let Points : number[] = [] ;
    for (let i = 0; i < Statistic.length - 1; i++) {
      let Temp = Statistic[i + 1].Amount - Statistic[i].Amount ;
      Temp /= Statistic[i].Amount ;
      Temp *= 100 ;
      Points.push(+Temp.toFixed(2)) ;
    }
    return Points ;
  }

  public AddCustomer(Name : string , Email : string , Password : string , Rule : CustomerType) {
    return this.HTTP.post<any>(`${AuthenticationService.API_Location}api/admin/dashboard/user/add` , {
      name : Name ,
      email : Email ,
      password : Password ,
      password_c : Password ,
      rule : Rule.toString()
    } , { headers : new HttpHeaders({"Authorization" : (<UserModel>this.AccountAdmin).GetToken()})})
      .pipe(take(1) , map(Value => {
        return !(Value instanceof HttpErrorResponse) ;
      }));
  }
}

enum CustomerType {
  User,
  Owner
}
