import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { RoomServiceComponent } from "./roomservice.component";
import { BehaviorSubject, Observable, tap } from "rxjs";
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

export interface addFavourite{
  id_facility:string[];
}

export interface addFavourite2{
  Object:addFavourite[];
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
         //http://192.168.43.181:8000/api/facilities/search
         //https://laravelprojectfinal.000webhostapp.com/public/api/facilities/search
           ('http://laravelapimk.atwebpages.com/public/api/facilities/search?page='+this.id
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
  return this.http.get<ResponseFavourites>('http://laravelapimk.atwebpages.com/public/api/favorite/index',options)
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
      .post('http://laravelapimk.atwebpages.com/public/api/favorite/toggle',
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
      .post('http://laravelapimk.atwebpages.com/public/api/favorite/toggle',
      {id_facility:body}, 
       options
      )
      .subscribe((res) => console.log(res));
}

}
