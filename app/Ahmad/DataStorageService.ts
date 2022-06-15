import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RoomServiceComponent } from "./roomservice.component";
import { BehaviorSubject, Observable, tap } from "rxjs";
import {  Room } from "./room.model";
import { Images } from "./ImagesOfroom.model";

interface SearchData{
    "room":
   {
    order:string,
    type:string,
    wifi:number,
    cost1:number,
    cost2:number,
    num_guest:number,
    num_room:number,
    bestrate:number,
   }
}


interface ResponseRooms {
  current_page : number ;
  facilities : FacilityDetails[] ;
  total_items : number ;
  url_first_page : string ;
  url_last_page : string ;
  url_next_page : string ;
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


@Injectable({providedIn:'root'})
export class DataStoragrService{
    room : BehaviorSubject<Room | null> ;
    constructor(
        private http:HttpClient,
        private roomservice:RoomServiceComponent
        ){
            this.room = new BehaviorSubject<Room | null>(null);
        }
        //location,dateFrom,dateTo,cost1,cost2,rate,type,wifi,coffe,tv,fridge,air_conditioning,op
    SearchingData(loc:string,dateF:string,dateT:string,cost1:number,cost2:number,rate:number,
      type:string,wifi:number,coffe:number,tv:number
      ,fridge:number,air_conditioning:number,op:string,roomNum:number,adultNum:number,bestRate:number)
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
         return this.http.get<ResponseRooms>
         //https://laravelprojectfinal.000webhostapp.com/public/api/facilities/search
           ('https://laravelprojectfinal.000webhostapp.com/public/api/facilities/search'
           ,
           {
             params:queryParams
           }
           ).subscribe(
            data => {
               console.log(data);
                 this.roomservice.setRooms(data.facilities);
            }
           );

 
       
        

    


}

}
