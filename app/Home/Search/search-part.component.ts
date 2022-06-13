import {Component, ViewChild} from '@angular/core';
import {AbstractControl, NgForm} from "@angular/forms";
import { DatePipe } from '@angular/common'
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-part',
  templateUrl: './search-part.component.html',
  styleUrls: ['../../Data_Sharing/BootStraps/bootstrap_Elbert.css' , './css/style.css'
    , './css/responsive.css' , '../../Fonts/css/fontello.css'] ,
  providers : [DatePipe]
})
export class SearchPartComponent {

  Adults : number ;

  Arrival : Date ;

  @ViewChild("Part") DataForm !: NgForm ;

  constructor(private ProcessDate : DatePipe ,private Route : Router) {
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
    if(this.DataForm.invalid)
      return ;
    let QueryParamsRoute : {
      location : string ,
      arrival ?: string ,
      departure ?: string,
      person : number
    } = {
      location: this.DataForm.form.value['Location'] ,
      person: this.Adults ,
    }
    if(this.DataForm.form.value['Arrival_D'] != undefined) {
      let Temp : Date ;
      Temp = new Date(Date.parse(this.DataForm.form.value['Arrival_D'])) ;
      QueryParamsRoute.arrival = <string>this.ProcessDate.transform(Temp , "yyyy-MM-dd") ;
      Temp = new Date(Date.parse(this.DataForm.form.value['Departure_D'])) ;
      QueryParamsRoute.departure = <string>this.ProcessDate.transform(Temp , "yyyy-MM-dd") ;
    }
    this.Route.navigate(['/search'] , {
      queryParams : QueryParamsRoute
    })
  }
}
