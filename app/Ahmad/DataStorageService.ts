import { ErrorHandler, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { RoomServiceComponent } from "./roomservice.component";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import {  Room } from "./room.model";
import { Images } from "./ImagesOfroom.model";
import { UserModel } from "../Data_Sharing/Model/user.model";
import { AuthenticationService } from "../Windows_PopUp/Authentication/authentication.service";
import { test } from "./test.model";



interface ResponseRooms {
  current_page : number ;
  facilities : FacilityDetails[] ;
  total_items : number ;
  url_first_page : string ;
  url_last_page : string ;
  url_next_page : string ;
} 




interface ResponseFavourites{
  Data:FacilityDetails[] ;
}


export class idFavo{
  id_facility!:string[];
  constructor(id_facility:string[]){
    this.id_facility=id_facility;
  }
}

interface ResponseBooking {
  "booking": {
    "id_user": number ,
    "id_facility": number ,
    "cost": number , 
    "start_date": string,
    "end_date": string,
    "created_at": string,
    "id": number
  }
}

export interface FacilityDetails {
  air_condition : number;
	coffee_machine : number;
	cost : number ;
	created_at : string ;
	description : string ;
	fridge : number ;
	id : number ;
	id_user : number ;
	location : string ;
	name : string ;
	num_guest : number;
	num_room : number ;
	photos : Images[];//{id_photo : number , path_photo : string}[];
	rate : number ;
	tv : number ;
	type : string;
	wifi : number;
}

interface ResponseFacilityDetailsOwner{
  Data:FacilityDetailsowner[] ;
}

export interface FacilityDetailsowner {
  air_condition : number;
	coffee_machine : number;
	cost : number ;
	created_at : string ;
  //updated_at:string;
	description : string ;
	fridge : number ;
	id : number ;
	id_user : number ;
	location : string ;
	name : string ;
	num_guest : number;
	num_room : number ;
	photos :{id : number,id_facility:number , path_photo : string}[];
	rate : number ;
	tv : number ;
	type : string;
	wifi : number;
}

export interface addFavourite{
  id_facility:string[];
}

export interface addFavourite2{
  Object:addFavourite[];
}

export interface Error{
  Error : {
    facility:string
  };
}
interface facility{
  
}




@Injectable({providedIn:'root'})
export class DataStoragrService{
  

    id=1;
    room : BehaviorSubject<Room | null> ;Acount!:UserModel;
    constructor(private auth:AuthenticationService,
        private http:HttpClient,
        private roomservice:RoomServiceComponent
        ){
      /*    auth.Account.subscribe((value)=>{
            if(value!=null){
            console.log('logging in');
            console.log(value.GetToken());
           // console.log(this.Acount.GetToken());
          }
          })*/
            this.room = new BehaviorSubject<Room | null>(null);
        }

        static API_Location : string = "http://127.0.0.1:8000/" ;
        //location,dateFrom,dateTo,cost1,cost2,rate,type,wifi,coffe,tv,fridge,air_conditioning,op
    SearchingData(loc:string,dateF:string,dateT:string,cost1:number,cost2:number,rate:number,
      type:string,wifi:number,coffe:number,tv:number
      ,fridge:number,air_conditioning:number,op:string,roomNum:number,adultNum:number,bestRate:number
      ,pageID:number)
        {
          let queryParams = new HttpParams();
          if(loc!="default")
          queryParams = queryParams.append("location",loc);
          if(dateF!="default"||dateT!="default"){
          queryParams = queryParams.append("start_date",dateF);
          queryParams = queryParams.append("end_date",dateT);
          }
          queryParams = queryParams.append("cost1",cost1);
          queryParams = queryParams.append("cost2",cost2);

          if(rate>0)queryParams = queryParams.append("rate",rate);
          if(type!="default")
          queryParams = queryParams.append("type",type);
          //////////////
          if(wifi||coffe||tv||fridge||air_conditioning){

          queryParams = queryParams.append("wifi",wifi);
          queryParams = queryParams.append("coffee_machine",coffe);
          queryParams = queryParams.append("tv",tv);
          queryParams = queryParams.append("fridge",fridge);
          queryParams = queryParams.append("air_condition",air_conditioning);
          
        }
        if(bestRate){
          queryParams = queryParams.append("bestrate",bestRate);
        }
          /////////////
        //  queryParams = queryParams.append("op",op);
          if(roomNum>1){
          queryParams = queryParams.append("num_room",roomNum);
          queryParams = queryParams.append("num_guest",adultNum);

        }
        if(pageID==1)this.id=1;
         return this.http.get<ResponseRooms>
         //http://192.168.43.55:8000/api/facilities/search
         //https://laravelprojectfinal.000webhostapp.com/public/api/facilities/search
           (`${DataStoragrService.API_Location}api/facilities/search?page=`+this.id
           ,
           {
             params:queryParams
           }
           ).subscribe(
            data => {
               console.log(data);
               if(this.id==1)
                 {this.roomservice.setRooms(data.facilities);this.id++;}
                 else {
                   this.roomservice.onAddRooms(data.facilities);this.id++;
                 }

            }
           );
}



getFavouriteList(){//(<UserModel>this.Acount).GetToken()
 // if()
 console.log('token');
 /*if(this.Acount == undefined)
  return ;*/
  let options={
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
  //http://192.168.43.181:8000/api/favorite/index
  return this.http.get<ResponseFavourites>(`${DataStoragrService.API_Location}api/favorite/index`,options)
  .subscribe(
    data => {
       console.log(data);
         this.roomservice.setfavouriteFacilities(data.Data);
    }
   );
}

idd!:addFavourite;
addToFavouriteList(){
  let options = {
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
    let body =
    this.roomservice.getfavouriteFacilities()[this.roomservice.getfavouriteFacilities().length-1].id;
  console.log(body);
     return this.http
      .post(`${DataStoragrService.API_Location}api/favorite/toggle`,
      {id_facility:body}, 
       options
      )
      .subscribe((res) => console.log(res));
}

removeFromFavouriteList(id:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
    let body = id;
    console.log(body);
     return this.http
      .post(`${DataStoragrService.API_Location}api/favorite/toggle`,
      {id_facility:body}, 
       options
      )
      .subscribe((res) => console.log(res));
}
private arr:string[] =[];
storeFacilityOwner(aircond:number,name:string,loc:string,desc:string,img:string
   | ArrayBuffer|null ,cost:number,
  type:string,adult:number,rooms:number,wifi:number,coffee:number,fridge:number,tv:number){
    console.log(aircond);console.log(name);console.log(loc);console.log(desc);console.log(img);
    console.log(cost);console.log(type);console.log(adult);console.log(rooms);console.log(wifi);
    console.log(coffee);console.log(fridge);console.log(tv);
    let options = {
      headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
    };
   console.log(img);
   this.arr.push('');
      // Store form name as "file" with file data
     // formData.append("file", img, img.name);
      //console.log(formData);
    return this.http
    .post(`${DataStoragrService.API_Location}api/facility/store`,
    {
      air_condition:"1",
      name:name,
      location:loc,
      description:desc,
      photo_list:img,
      cost:cost,
      type:"chalet",
      num_guest:adult,
      num_room:rooms,
      wifi:"1",
      coffee_machine:"1",
      fridge:"0",
      tv:"1"
    }, 
     options
    )
    .subscribe((res) => console.log(res));
}

removeOwnerFacility(index:number){
  console.log(index);
  let options = {
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
    //let body = id;
    //console.log(body);
    let qwer=`${DataStoragrService.API_Location}api/facility/delete/`+index+'?_method=DELETE';
    console.log('qwer: '+qwer);
     return this.http
      .delete(`${DataStoragrService.API_Location}api/facility/delete/`+index,options)
      .subscribe((res) => console.log(res));
}

getOwnerFacility(){
  let options={
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
  //http://192.168.43.181:8000/api/favorite/index
  return this.http.get<ResponseFacilityDetailsOwner>
  (`${DataStoragrService.API_Location}api/facility/index`,options)
  .subscribe(
    data => {
       console.log(data);
         this.roomservice.setFacilityOwner(data.Data);
    }
   );
}
updateOwnerFacility(facName:string,desc:string,loc:string,type:string,roomNum:number,adultNum:number,
  cost:number,wifi:number,tv:number,cond:number,cofee:number,fridge:number,id:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
  console.log(id);console.log(facName);console.log(desc);console.log(loc);console.log(roomNum);
   console.log(type); console.log(adultNum); console.log(cost); console.log('fridge'+fridge);console.log('coffee'+cofee);
    console.log('wifi'+wifi);console.log('tv'+tv);console.log('cond'+cond);
  return this.http
  .post(`${DataStoragrService.API_Location}api/facility/update`,
  {
    air_condition:cond,
    name:facName,
    location:loc,
    description:desc,
    cost:cost,
    type:type,
    num_guest:adultNum,
    num_room:roomNum,
    wifi:wifi,
    coffee_machine:cofee,
    fridge:fridge,
    id:id,
    tv:tv
  },
   options
  )
  // .subscribe((res) => console.log(res));
  .subscribe((res) => console.log(res));
}

bookNow(startDate:string,endDate:string,id_F:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
  };
  console.log(id_F);


  let error:Error;
  return this.http
  .post<Error>(`${DataStoragrService.API_Location}api/bookings/booking`,
  {
    id_facility:id_F,
    start_date:startDate,
    end_date:endDate
  },
   options
  ).subscribe(data => {
    try{
      if(data.Error.facility!=null)
      alert(data.Error.facility);
    }
    catch(Exception){
      alert('Booking Successful');
      console.log('successful');
    
    }
    
     
    //console.log(data.Error.facility);
    

 });
}

private handleError(errorRes: HttpErrorResponse) {
  
  let errorMessage = 'An unknown error occurred!';
  alert(errorMessage);
  // if (!errorRes.error || !errorRes.error.error) {
  //   {
  //     console.log('errrrrror');
      
  //     return throwError(errorMessage);}
  // }

  alert('there is an error');
  // switch (errorRes.error.facility) {
  //   case 'The Facility is Not Available in Between This Date :(':alert(errorMessage);
  //     errorMessage = 'thi fac not ava';
  //     break;
  //   case 'EMAIL_NOT_FOUND':
  //     errorMessage = 'This email does not exist.';
  //     break;
  //   case 'INVALID_PASSWORD':
  //     errorMessage = 'This password is not correct.';
  //     break;
  //     default:errorMessage = 'thi fac not ava';alert(errorMessage);
      
  // }

  
  console.log(errorMessage);
  return throwError(errorMessage);
}


}
