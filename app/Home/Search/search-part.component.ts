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

  Arrival : {IsActive : boolean , DateDetermine : Date} ;

  @ViewChild("Part") DataForm !: NgForm ;

  constructor(private ProcessDate : DatePipe ,private Route : Router) {
    this.Adults = 1 ;
    this.Arrival = {
      IsActive : false ,
      DateDetermine : new Date()
    }
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

  onSubmit() : void {
    if(this.DataForm.invalid)
      return ;
    let Temp : Date ;
    let Location = this.DataForm.form.value['Location'];
    Temp = new Date(Date.parse(this.DataForm.form.value['Departure_D'])) ;
    let Departure_D = this.ProcessDate.transform(Temp , "yyyy-MM-dd") ;
    Temp = new Date(Date.parse(this.DataForm.form.value['Arrival_D'])) ;
    let Arrival_D = this.ProcessDate.transform(Temp , "yyyy-MM-dd") ;
    this.Route.navigate(['/search'] , {
      queryParams : {
          location : Location ,
          arrival : Arrival_D ,
          departure : Departure_D,
          person : this.Adults
      }}
    )
  }
}
