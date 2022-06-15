import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Options } from 'ng5-slider';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { RoomDetailsComponent } from '../room-list/room-item/room-details/room-details.component';
import { DataStoragrService, FacilityDetails } from '../DataStorageService';
import { RoomServiceComponent } from '../roomservice.component';
import { SearchPartComponent } from 'src/app/Home/Search/search-part.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  './search.component.css','../room-list/room-item/room-details/room-details.component.css'
  ,'../../Fonts/css/animate.min.css','../../Fonts/css/menu.css',
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

 

  constructor(private roomService:RoomServiceComponent,private datastorage:DataStoragrService) {
      if(this.roomService.getCheck()){
        
        this.Adults=this.roomService.getAdults();
        this.Arriv=this.roomService.getArrival();
        this.Depture=this.roomService.getDept();
        this.dateF=this.roomService.getArrival()!;
        this.dateT=this.roomService.getDept()!;
        this.location=this.roomService.getLoc();
        console.log(this.Adults);
        console.log(this.Arriv);console.log(this.Depture);console.log(this.location);
      }
       else {
    this.Adults = 0 ;
    this.Rooms = 0 ;
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

  ngOnInit(): void {

    if(!this.roomService.getCheck()){
      
this.datastorage.SearchingData
("default","default","default",0,1000000,0,"default",0,0,
  0,0,0,"=",0,0,0);
    }
    else {this.roomService.setCheck(false);
      this.default=this.location;
      this.dateF=this.Arriv!;
      this.dateT=this.Depture!;
      this.datastorage.SearchingData
(this.location,this.Arriv!,this.Depture!,0,1000000,0,"default",0,0,
  0,0,0,"=",0,0,0);
    }
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
    if(this.Adults - 1 >= 0)
      this.Adults-- ;
  }
}

ChangeRooms(Process : boolean) : void {
  if(Process) {
    if(this.Rooms + 1 <= 20)
      this.Rooms++ ;
  } else {
    if(this.Rooms - 1 >= 0)
      this.Rooms-- ;
  }
}

  onSubmit(form:NgForm){
    
    const val=form.value;
    this.dateF=val.datein;
    this.dateT=val.dateout;
    let location=val.city;
    let dateFrom=val.datein;
    let dateTo=val.dateout;
    console.log(dateFrom);
    console.log(dateTo);
    let roomNum=1;
    let adultNum=1;
    let cost1=this.minValue;
    let cost2=this.maxValue;
    let rate=this.currentRate;
    let type="default";
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
    if(this.checkChalet)type="chalet";
    else if(this.checkResort)type="resort";
    else if(this.checkHostel)type="hostel";
    if(val.rooms>1){
      roomNum=val.rooms;
      adultNum=val.adults;
    }
    //else type="chalet";

    


console.log(location);
console.log(dateFrom);
console.log(dateTo);
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


this.datastorage.SearchingData
(location,dateFrom,dateTo,cost1,cost2,rate,type,wifi,coffe,
  tv,fridge,air_conditioning,op,roomNum,adultNum,bestRate);



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
 


}


