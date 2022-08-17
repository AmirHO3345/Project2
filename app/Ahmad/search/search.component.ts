import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Options } from 'ng5-slider';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { RoomDetailsComponent } from '../room-list/room-item/room-details/room-details.component';
import { DataStoragrService, FacilityDetails } from '../DataStorageService';
import { RoomServiceComponent } from '../roomservice.component';
import { SearchPartComponent } from 'src/app/Home/Search/search-part.component';
import { AuthenticationService } from 'src/app/Windows_PopUp/Authentication/authentication.service';
import { UserModel } from 'src/app/Data_Sharing/Model/user.model';
import { arrow } from '@popperjs/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../room-list/room-item/room-details/room-details.component.css'
  ,'../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  './search.component.css','../../Fonts/css/animate.min.css','../../Fonts/css/menu.css',
  '../../Fonts/css/style.css','../../Fonts/css/responsive.css',
  '../../Fonts/css/fontello/css/icon_set_1.css','../../Fonts/css/icon_set_2.css',
  '../../Fonts/css/fontello/css/fontello.css','../../Fonts/css/magnific-popup.css',
  '../../Fonts/css/owl.theme.default.css','../../Fonts/css/owl.carousel.css',
  '../../Fonts/css/Date_Time_Picker.css']
})
export class SearchComponent implements OnInit {

  default="default";
  dateF="default";
  dateT="default";
  currentDate = new Date();
  tag=false;
  roomForm!:FormGroup;
  @Input() room!: FacilityDetails;
  @Input() index!:number;
  @Input() currentRate=0;
  selectedRoom!:FacilityDetails;
 currentValue: number = 100;
 minValue:number=0;
 maxValue:number=5000;

 options:Options={
   floor:0,
   ceil:5000
 };
 @Input()Adults !: number ;
 Rooms !: number ;

 Arriv?:string;
 Depture?:string;
 location!:string;


 Arrival !: {IsActive : boolean , DateDetermine : Date} ;

 @ViewChild("Part") DataForm !: NgForm ;

 

 Account!:UserModel;
  constructor(private roomService:RoomServiceComponent,private datastorage:DataStoragrService,
    private auth:AuthenticationService,private ProcessDate:DatePipe) {
      if(this.roomService.getCheck()){
        auth.Account.subscribe((value)=>{
          if(value!=null){console.log('logging in');
          console.log(value);
          console.log(this.Account.GetToken());}
        });
        
        this.Adults=this.roomService.getAdults();
        this.Rooms=1;
        this.Arriv=this.roomService.getArrival();
        this.Depture=this.roomService.getDept();
        this.dateF=this.roomService.getArrival()!;
        this.dateT=this.roomService.getDept()!;
        this.location=this.roomService.getLoc();
        console.log(this.Adults);
        console.log(this.Arriv);console.log(this.Depture);console.log(this.location);
      }
       else {
    this.Adults = 1 ;
    this.Rooms = 1 ;
    this.Arrival = {
      IsActive : false ,
      DateDetermine : new Date()
    }
       }

   } 

  ChangeArrival(CurrentDate : Date ) : void {
    if(this.DataForm.form.value['Departure_D'] != undefined)
          (<AbstractControl>this.DataForm.form.get("Departure_D")).reset();
    if(Date != undefined) {
      this.Arrival = {
        IsActive : true ,
        DateDetermine : new Date(+CurrentDate + (1000*60*60*24))
      };
    } else
      this.Arrival.IsActive = false ;
  }

  DateNow() : Date {
    return new Date();
  } 
  
  isLoadingSpinner=false;
  ngOnInit(): void {
    this.isLoadingSpinner=true;
   let type:string[]=[];
   type.push("default");
    if(!this.roomService.getCheck()){
      this.isLoadingSpinner=true;
this.datastorage.SearchingData
("default","default","default",0,1000000,0,type,0,0,
  0,0,0,"=",0,0,0,1);
  
    }
    else {this.roomService.setCheck(false);
      this.default=this.location;
      this.dateF=this.Arriv!;
      this.dateT=this.Depture!;
      this.datastorage.SearchingData
(this.location,this.Arriv!,this.Depture!,0,1000000,0,type,0,0,
  0,0,0,"=",0,0,0,1);
    }
    this.isLoadingSpinner=false;

  }
  getCurrentRating(){
    return this.currentRate;
  }
  getDateOut(){
   var nextDays = new Date(new Date().setDate(new Date().getDate() + 1)); 
    return  nextDays;//this.currentDate.setDate( this.currentDate.getDate() + 1 );
  }
  getRoomNum(){
    return this.roomService.getRoomsNuber();
  }
  checkBoxValue: any = false;
  checkCheckBoxvalue(){
      console.log(this.checkBoxValue)
  }
checkChalet=false;
checkingChalet(){
  this.checkChalet=!this.checkChalet;
  //console.log(this.checkChalet);
}
checkHostel=false;
checkingHostel(){
  this.checkHostel=!this.checkHostel;
  console.log(this.checkHostel);
}
checkResort=false;
checkingResort(){
  this.checkResort=!this.checkResort;
}

checkWIFI=false;
checkingWIFI(){
  this.checkWIFI=!this.checkWIFI;
}

checkTV=false;
checkingTV(){
  this.checkTV=!this.checkTV;
}

checkFridge=false;
checkingFridge(){
  this.checkFridge=!this.checkFridge;
}
checkCoffee=false;
checkingCoffee(){
  this.checkCoffee=!this.checkCoffee;
}
checkAir_cond=false;
checkingAir_cond(){
  this.checkAir_cond=!this.checkAir_cond;
}


BestRate=false;
checkBestRate(){
this.BestRate=!this.BestRate;
}
ChangeAdults(Process : boolean) : void {
  if(Process) {
    if(this.Adults + 1 <= 20)
      this.Adults++ ;
  } else {
    if(this.Adults - 1 >= 1)
      this.Adults-- ;
  }
}

ChangeRooms(Process : boolean) : void {
  if(Process) {
    if(this.Rooms + 1 <= 20)
      this.Rooms++ ;
  } else {
    if(this.Rooms - 1 >= 1)
      this.Rooms-- ;
  }
}
@HostListener("window:scroll", []) onWindowScroll() {
  this.scrollFunction();
  //this.onWindowScrolll();
}
// When the user scrolls down 20px from the top of the document, show the button
scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("myBtn")!.style.display = "block";
  } else {
      document.getElementById("myBtn")!.style.display = "none";
  }
  let pos = (document.documentElement.scrollTop || document.body.scrollTop)
 + document.documentElement.offsetHeight;
let max = document.documentElement.scrollHeight;/*
pos.toFixed(0);
max.toFixed(0);
Math.floor(max);
console.log(pos.toFixed(0));
console.log(max);*/
let curposition=pos.toFixed(0);
let maxx=max.toFixed(0);
// console.log(curposition);
// console.log(maxx);
let maxxx= +maxx;
//maxxx-=200;
let currpos= +curposition;
let check=false;
// pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
 if(currpos== maxxx||currpos== maxxx+1||currpos== maxxx+2 )   {
   if(!check){check=true; console.log('downArrive'); console.log(check);
 this.LoadMore();


}
 //Do your action here
 //console.log("hello prother");

 }
 else {
   check=false;

 }
}

// When the user clicks on the button, scroll to the top of the document
topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} //private ProcessDate!:DatePipe;
//@HostListener("window:scroll", ["$event"])
// onWindowScrolll() {
// //In chrome and some browser scroll is given to body tag
// let pos = (document.documentElement.scrollTop || document.body.scrollTop)
//  + document.documentElement.offsetHeight;
// let max = document.documentElement.scrollHeight;
// // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
//  if(pos == max )   {
//  //Do your action here
//  console.log("hello prother");
//  }
// }

date1!:string;
date2!:string;/*
location,dateFr,dateToo,cost1,cost2,rate,type,wifi,coffe,
  tv,fridge,air_conditioning,op,roomNum,adultNum,bestRate*/

  locF="default";
  dateF1="default";
  dateF2="default";
  cost1F=0;
  costF2=1000000;
  rateF=0;
  type:string[]=[];
  wifiF=0;
  coffeeF=0;
  tvF=0;
  fridgeF=0;
  air_conditioningF=0;
  opF="=";
  roomNumF=0;
  adultNumF=0;
  bestRateF=0;/*
  "default","default","default",0,1000000,0,"default",0,0,
  0,0,0,"=",0,0,0*/
  onSubmit(form:NgForm){
    
    const val=form.value;
    this.dateF=val.datein;
    this.dateT=val.dateout;
    let location=val.city;
    let dateFrom:Date;
    let dateTo:Date;
    dateFrom= new Date(Date.parse(val.datein)) ;  
    dateTo=new Date(Date.parse(val.dateout)) ;  
    let roomNum=1;
    let adultNum=1;
    let cost1=this.minValue;
    let cost2=this.maxValue;
    let rate=this.currentRate;
    let type:string[]=[];
    type.push("default");
    let wifi=0;
    let coffe=0;
    let tv=0;
    let fridge=0;
    let air_conditioning=0;
    let op="=";
    let bestRate=0;
    if(this.BestRate)bestRate=1;
    if(this.checkWIFI)wifi=1;
    if(this.checkCoffee)coffe=1;
    if(this.checkAir_cond)air_conditioning=1;
    if(this.checkTV)tv=1;
    if(this.checkFridge)fridge=1;
    if(this.checkChalet)type.push("chalet");
   if(this.checkResort)type.push("resort");
   if(this.checkHostel)type.push("hostel");
    if(val.rooms>1){
      roomNum=val.rooms;
      adultNum=val.adults;
    }
    //else type="chalet";

    
  
   /*this.dateFr= <string>this.ProcessDate.transform(dateFrom , "yyyy-MM-dd") ;
    this.dateTY= <string>this.ProcessDate.transform(dateTo , "yyyy-MM-dd") ;

    console.log(this.dateFr);
    console.log(this.dateTY);*/
   

  //  Temp = new Date(Date.parse(this.DataForm.form.value['Arrival_D'])) ;
/*
  console.log(dateFrom);let 
  console.log(dateTo);*/
  let dateFr="default";
  let dateToo="default";
  let check=false;
  if(dateFrom!=undefined && dateTo!=undefined){
    try{

      dateFr = <string>this.ProcessDate.transform(dateFrom , "yyyy-MM-dd") ;
      dateToo = <string>this.ProcessDate.transform(dateTo , "yyyy-MM-dd") ;
    }
    catch(Exception){
      
   dateFr="default";
   dateToo="default";
    }
  }
    /*console.log(dateFr);
    console.log(dateToo);*/
    if(dateFr!=undefined && dateToo!=undefined){
      this.date1=dateFr;
      this.date2=dateToo;
    }

console.log(location);
console.log(dateFr);
console.log(dateToo);
console.log(roomNum);
console.log(adultNum);
console.log(cost1);
console.log(cost2);
console.log(rate);
console.log(type);
console.log(wifi);
console.log(coffe);
console.log(tv);
console.log(fridge);
console.log(air_conditioning);
//console.log(op);

this.locF=location;
this.dateF1=dateFr;
this.dateF2=dateToo;
this.cost1F=cost1;
this.costF2=cost2;
this.rateF=rate;
this.type=type;
this.wifiF=wifi;
this.coffeeF=coffe;
this.tvF=tv;
this.fridgeF=fridge;
this.air_conditioningF=air_conditioning;
this.opF=op;
this.roomNumF=roomNum;
this.adultNumF=adultNum;
this.bestRateF=bestRate;
if(dateFr==undefined||dateToo==undefined){
  dateFr="default";
  dateToo="default";
}
console.log("dsfdsf");
console.log(dateFr+"         "+dateToo);
this.isLoadingSpinner=true;
console.log(this.isLoadingSpinner);
this.datastorage.SearchingData
(location,dateFr,dateToo,cost1,cost2,rate,type,wifi,coffe,
  tv,fridge,air_conditioning,op,roomNum,adultNum,bestRate,1);
  
  this.isLoadingSpinner=false;
  console.log(this.isLoadingSpinner);

  //console.log(this.datastorage.fetchSearchingData());
//this.datastorage.SearchingData("1","chalet",0,200,500,2,1,0);

  //console.log(val.controls['chalet'].value);


  /* type:"chalet";
   wifi:0;
   minV:this.minValue;
   maxV:this.maxValue;
   num_guest:3;
   num_room:3;
   */
   //this.AssignSearching(val.order,val.type,val.wifi,val.minV,val.maxV,val.num_guest,val.num_room);
    //this.datastorage.storeSearchingData()

  




  /*
  let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd');
  console.log(latest_date);*/

}
 

LoadMore(){
  this.isLoadingSpinner=true;
this.datastorage.SearchingData
(this.locF,this.dateF1,this.dateF2,this.cost1F,this.costF2,this.rateF,this.type
  ,this.wifiF,this.coffeeF,
this.tvF,this.fridgeF,this.air_conditioningF,this.opF,this.roomNumF,this.adultNumF,this.bestRateF,0);
 this.isLoadingSpinner=false;

}


}


