import {Component, Input, ViewChild} from '@angular/core';
import {AbstractControl, NgForm} from "@angular/forms";
import { DatePipe } from '@angular/common'
import {Router} from "@angular/router";
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';

@Component({
  selector: 'app-search-part',
  templateUrl: './search-part.component.html',
  styleUrls: ['../../Data_Sharing/BootStraps/bootstrap_Elbert.css' , './css/style.css'
    , './css/responsive.css' , '../../Fonts/css/fontello.css']
})
export class SearchPartComponent {

 Adults:number;

  Arrival : Date ;

  loc!:string;
  arrival!:string;
  dept!:string;
  check=false;
  

  @ViewChild("Part") DataForm !: NgForm ;

  constructor(private ProcessDate : DatePipe ,private Route : Router,private roomser:RoomServiceComponent) {
    this.Adults = 1 ;
    this.Arrival = new Date() ;

  }

  // True : + | Else : -
  ChangeAdults(Process : boolean) : void {
    if(Process) {
      if(this.Adults + 1 <= 20)
        this.Adults++ ;
    } else {
      if(this.Adults - 1 >= 1)
        this.Adults-- ;
    }
  }

  ChangeArrival(CurrentDate : Date ) : void {
    if(this.DataForm.form.value['Departure_D'] != undefined)
          (<AbstractControl>this.DataForm.form.get("Departure_D")).reset();
    if(CurrentDate != undefined)
      this.Arrival = new Date(+CurrentDate + (1000*60*60*24)) ;
  }

  DateNow() : Date {
    return new Date();
  }

  ClearDate(ControllerName : string) {
    if(this.DataForm.form.get(ControllerName) != null)
      (<AbstractControl>this.DataForm.form.get(ControllerName)).reset();
  }

  onSubmit() : void {
    this.check=false;
    if(this.DataForm.invalid)
      return ;
    let QueryParamsRoute : {
      location : string ,
      arrival ?: string ,
      departure ?: string,
      person : number
    } = {
      location: this.DataForm.form.value['location'] ,
      person: this.Adults ,
    }
    if(this.DataForm.form.value['Arrival_D'] != undefined) {
      let Temp : Date ;
      Temp = new Date(Date.parse(this.DataForm.form.value['Arrival_D'])) ;
      QueryParamsRoute.arrival = <string>this.ProcessDate.transform(Temp , "yyyy-MM-dd") ;
      console.log(QueryParamsRoute.arrival);
      Temp = new Date(Date.parse(this.DataForm.form.value['Departure_D'])) ;
      QueryParamsRoute.departure = <string>this.ProcessDate.transform(Temp , "yyyy-MM-dd") ;
      console.log(QueryParamsRoute.departure);
      
     
    }console.log("adu"+this.Adults);
    this.loc=this.DataForm.form.value['location'];
    console.log("loc"); 
    this.check=true;
    this.roomser.setSendToSearch(this.loc,QueryParamsRoute.arrival,QueryParamsRoute.departure,this.Adults,true);
    this.Route.navigate(['/search'] , {
      queryParams : QueryParamsRoute
   })
  }
  // sendToSearch(loc:string,arrival:string,dept:string,adult:number){
  //   loc=this.loc;
  //   arrival=this.arrival;
  //   dept=this.dept;
  //   adult=this.Adults;
  // }
  getCheck(){
    return this.check;
  }


  getAdults(){
    return this.Adults;
  }
  getArrival(){
    return this.arrival;
  }
  getDept(){
    return this.dept;
  }
  getLoc(){
    return this.loc;
  }
}
