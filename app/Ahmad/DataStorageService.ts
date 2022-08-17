import { ComponentFactoryResolver, ErrorHandler, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { RoomServiceComponent } from "./roomservice.component";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import {  Room } from "./room.model";
import { Images } from "./ImagesOfroom.model";
import { UserModel } from "../Data_Sharing/Model/user.model";
import { AuthenticationService } from "../Windows_PopUp/Authentication/authentication.service";
import { test } from "./test.model";



interface ResponseRooms {
  Error:string,
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

interface resroomDet{
  Data:FacilityDetails;
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

export interface bookListAll{
  current_page:number,
  infoBookings:bookList[],
  total_items:number,
  total_pages:number,
  url_first_page:string,
  url_last_page:string,
  url_next_page:string

}

export interface bookList{
  cost:number,
  created_at:string,
  end_date:string,
  id:number,
  id_facility:number,
  id_user:number,
  name:string,
  path_photo:string,
  start_date:string
}

export interface Error{
  message:string,
  booking:{
    cost:number,
    created_at:string,
    end_date:string,
    id:number,
    id_facility:number,
    id_user:number,
    start_date:string
  }
  Error : {
    facility:string,
    user:string,
    date:string
  };
}
interface responseFav{
  message:string;
  
}

interface cost{
  cost:number;
}

interface reviewsAll{
  message:string,
  current_page:number,
  reviews:reviews[],
  total_items:number,
  total_pages:number,
  url_first_page:string,
  url_last_page:string,
  url_next_page:string
}

export interface reviews{
  id:number,
  id_facility:number,
  id_user:number,
  comment:string,
  rate:number,
  created_at:string,
  updated_at:string,
  user:{
    name:string,
    path_photo:string
  }
}

export interface MyProfile{
  user:{
    id:number,
    name:string,
    email:string,
    rule:string,
    amount:string
  },
  profile:{
    id_user:number,
    path_photo:string,
    phone:number,
    gender:string,
    age:number
  }
}

export interface OtherProfile{
  Message:string,
  user:{
    id:number,
    name:string,
    email:string,
    rule:string,
    amount:string,
    profile:{
      id_user:number,
      path_photo:string,
      phone:number,
      gender:string,
      age:number
    }
  }
}




@Injectable({providedIn:'root'})
export class DataStoragrService{
  



    id=1;
    room : BehaviorSubject<Room | null> ;Acount!:UserModel;accou!:string;
    constructor(private auth:AuthenticationService,//private user:UserModel,
        private http:HttpClient,
        private roomservice:RoomServiceComponent
        ){

         auth.Account.subscribe((value)=>{
            if(value!=null){
            console.log('logging in');
            console.log(value.GetToken());
            this.accou=value.GetToken();
           // console.log(this.Acount.GetToken());
          }
          })
            this.room = new BehaviorSubject<Room | null>(null);
        }

        static API_Location : string = "http://192.168.43.55:8000/" ;
        //location,dateFrom,dateTo,cost1,cost2,rate,type,wifi,coffe,tv,fridge,air_conditioning,op
    SearchingData(loc:string,dateF:string,dateT:string,cost1:number,cost2:number,rate:number,
      type:string[],wifi:number,coffe:number,tv:number
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
         // if(type[0]!="default"){
            console.log('chalet');
            let arr:string[]=[];
           // type.push('chalet');
            if(type[1]=="chalet"||type[2]=="chalet"||type[3]=="chalet"){
              queryParams = queryParams.append("type[]","chalet");

            }

            if(type[1]=="resort"||type[2]=="resort"||type[3]=="resort"){
              queryParams = queryParams.append("type[]","farmer");

            }if(type[1]=="hostel"||type[2]=="hostel"||type[3]=="hostel"){
              queryParams = queryParams.append("type[]","hostel");

            }
         //   console.log(type[0]);console.log(type[1]);console.log(type[2]);
       //     queryParams = queryParams.append("type[]",type[0]);

          //}
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
               if(data.Error!=null)alert(data.Error);else 
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
    headers:new HttpHeaders({"Authorization":this.accou})
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
    headers:new HttpHeaders({"Authorization":this.accou})
  };
    let body =
    this.roomservice.getfavouriteFacilities()[this.roomservice.getfavouriteFacilities().length-1].id;
  console.log(body);
     return this.http
      .post<responseFav>(`${DataStoragrService.API_Location}api/favorite/toggle`,
      {id_facility:body}, 
       options
      )
      .subscribe((res) => {
        console.log(res);
        alert(res.message);
      });
}

removeFromFavouriteList(id:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
    let body = id;
    console.log(body);
     return this.http
      .post<responseFav>(`${DataStoragrService.API_Location}api/favorite/toggle`,
      {id_facility:body},
       options
      )
      .subscribe((res) => {
        
        console.log(res);
        alert(res.message);
      });
}
private arr:string[] =[];
storeFacilityOwner(aircond:number,name:string,loc:string,desc:string,img:string
   | ArrayBuffer|null ,cost:number,
  type:string,adult:number,rooms:number,wifi:number,coffee:number,fridge:number,tv:number){
    console.log(aircond);console.log(name);console.log(loc);console.log(desc);console.log(img);
    console.log(cost);console.log(type);console.log(adult);console.log(rooms);console.log(wifi);
    console.log(coffee);console.log(fridge);console.log(tv);
    let options = {
      headers:new HttpHeaders({"Authorization":this.accou})
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
    headers:new HttpHeaders({"Authorization":this.accou})
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
    headers:new HttpHeaders({"Authorization":this.accou})
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
    headers:new HttpHeaders({"Authorization":this.accou})
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
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  console.log(this.accou);
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
      console.log(data);
      if(data.Error.facility!=null)
      alert(data.Error.facility);
      else if(data.Error.user!=null)
      alert(data.Error.user);
      else if(data.Error.date!=null)
      alert(data.Error.date);
      //else alert('Booking Successful');
    }
    catch(Exception){
      alert('Booking Successful');
      console.log('successful');
      console.log(data);
      this.roomservice.setbooking(data);
    }
 });
 
}

cancelBook(id_booking:number,id_facility:number){
  let options = {
    body:{
      id_booking:id_booking,
      id_facility:id_facility
  },
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  return this.http
  .delete<Error>(`${DataStoragrService.API_Location}api/bookings/unbooking`,
   options
  ).subscribe(data => {
    try{
      console.log(data.message);
      if(data.message==undefined)alert('you are not booking');else 
      // if(data.Error.facility!=null)
       alert(data.message);
      // else if(data.Error.user!=null)
      // alert(data.Error.user);
      // else if(data.Error.date!=null)
      // alert(data.Error.date);
      //else alert('Booking Successful');
    }
    catch(Exception){
      // alert('Booking Successful');
      // console.log('successful');
      // console.log(data);
    }
 });
}
viewCost(id_fac:number,startDate:string,endDate:string){
 
  let queryParams = new HttpParams();
   queryParams = queryParams.append("id_facility",id_fac);;
  queryParams = queryParams.append("start_date",startDate);
  queryParams = queryParams.append("end_date",endDate);
  return this.http.get<cost>
  (`${DataStoragrService.API_Location}api/bookings/costbooking`,
  {
    headers:new HttpHeaders({"Authorization":this.accou}),
    params:queryParams
  }
  )
  .subscribe(
    data => {
       console.log(data.cost);
       alert(data.cost);
    }
   );

}

getComments(id_facility:number){
  let queryParams = new HttpParams();
   queryParams = queryParams.append("id_facility",id_facility);
  return this.http.get<reviewsAll>
  (`${DataStoragrService.API_Location}api/user/review/show`,
  {
    //headers:new HttpHeaders({"Authorization":this.roomservice.getToken()}),
    params:queryParams
  }
  )
  .subscribe(
    data => {
       console.log(data);
       this.roomservice.setReviews(data.reviews);
     //  alert(data.cost);
    }
   );
}

setRate(id:number,rate:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  return this.http
      .post(`${DataStoragrService.API_Location}api/user/rate`,
      {
        id_facility:id,
        rate:rate
      },
       options
      )
      .subscribe((res) => {
        console.log(res);
        alert('your rate submitted successfully');
      });
}

setComment(id:number,comm:string){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  console.log(comm);
  return this.http
      .post(`${DataStoragrService.API_Location}api/user/comment`,
      {
        id_facility:id,
        comment:comm
      },
       options
      )
      .subscribe((res) => {
        console.log(res);
        alert('your comment submitted successfully');
      //  alert(res.message);
      });
}
deleteComment(idComm:number|null,idfac:number){
  if(idComm==null){alert("you are not commenting");return;}
  let options = {
    body:{
      id_review:idComm,
      id_facility:idfac
  },
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  return this.http
  .delete<reviewsAll>(`${DataStoragrService.API_Location}api/user/review/delete`,
   options
  ).subscribe(data => {
    alert(data.message);
    console.log(data);
    // try{
      
    //   if(data.message==undefined)alert('you are not booking');else 
    //   // if(data.Error.facility!=null)
    //    alert(data.message);
    //   // else if(data.Error.user!=null)
    //   // alert(data.Error.user);
    //   // else if(data.Error.date!=null)
    //   // alert(data.Error.date);
    //   //else alert('Booking Successful');
    // }
    // catch(Exception){
    //   // alert('Booking Successful');
    //   // console.log('successful');
    //   // console.log(data);
    // }
 });
}

showMyProfile(){
 return this.http.get<MyProfile>
 (`${DataStoragrService.API_Location}api/profile/show`,
 {
   headers:new HttpHeaders({"Authorization":this.accou}),
 }
 )
 .subscribe(
   data => {
      console.log(data);
      this.roomservice.setMyprofile(data);
    //  alert(data.cost);
   }
  );
}

showOtherProfile(id_user:number){
  let queryParams = new HttpParams();
   queryParams = queryParams.append("id_user",id_user);
   
  return this.http.get<OtherProfile>
  (`${DataStoragrService.API_Location}api/profile/other`,
  {
    headers:new HttpHeaders({"Authorization":this.accou}),
    params:queryParams
  }
  )
  .subscribe(
    data => {
       console.log(data);
       this.roomservice.setOtherprofile(data);
     //  alert(data.cost);
    }
   );
}
updateProfile(name:string,email:string,phone:string,gend:string,age:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  //console.log(comm);
  return this.http
      .post(`${DataStoragrService.API_Location}api/profile/update`,
      {
        name:name,
        email:email,
        phone:phone,
        gender:gend
      },
       options
      )
      .subscribe((res) => {
        console.log(res);
        alert('your information submitted successfully');
      //  alert(res.message);
      });
}

changePassword(pass:string){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  //console.log(comm);
  return this.http
      .post<OtherProfile>(`${DataStoragrService.API_Location}api/profile/update`,
      {
        password:pass
      },
       options
      )
      .subscribe((res) => {
        console.log(res);
        this.roomservice.setOtherprofile(res);
        alert(res.Message);
      //  alert(res.message);
      });
}

showfacility(id:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  console.log(id);
  
  let queryParams = new HttpParams();
   queryParams = queryParams.append("id",id);
  return this.http.get<resroomDet>(`${DataStoragrService.API_Location}api/facility/show/`+id,options
  )
  .subscribe((res)=>{
    console.log(res);
    this.roomservice.setroomDet(res.Data);
  })
}
bookNowOwner(startDate:string,endDate:string,id_F:number){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  console.log(this.accou);
  let error:Error;
  return this.http
  .post<Error>(`${DataStoragrService.API_Location}api/owner/booking`,
  {
    id_facility:id_F,
    start_date:startDate,
    end_date:endDate
  },
   options
  ).subscribe(data => {
    try{
      console.log(data);
      if(data.Error.facility!=null)
      alert(data.Error.facility);
      else if(data.Error.user!=null)
      alert(data.Error.user);
      else if(data.Error.date!=null)
      alert(data.Error.date);
      //else alert('Booking Successful');
    }
    catch(Exception){
      alert('Booking Successful');
      console.log('successful');
      console.log(data);
      this.roomservice.setbooking(data);
    }
 });
 
}



sendReport(id:number,report:string){
  let options = {
    headers:new HttpHeaders({"Authorization":this.accou})
  };
  //console.log(comm);
  return this.http
      .post(`${DataStoragrService.API_Location}api/report/add`,
      {
        id_facility:93,
        report:"report"
      },
       options
      )
      .subscribe((res) => {
        console.log(res);
       // this.roomservice.setOtherprofile(res);
        //alert(res.Message);
      //  alert(res.message);
      });
}


// displaybooking(){
//   let options = {
//     headers:new HttpHeaders({"Authorization":this.roomservice.getToken()})
//   };
//   return this.http.get<bookListAll>
//   (`${DataStoragrService.API_Location}api/bookings/show`,options)
//   .subscribe(
//     data => {
//        console.log(data);
//        this.roomservice.setbookingList(data.infoBookings);
//     }
//    );
// }

}




