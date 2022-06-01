import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { RoomDetailsComponent } from '../room-list/room-item/room-details/room-details.component';
import { Room } from '../room.model';
import { RoomServiceComponent } from '../roomservice.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  currentDate = new Date();
  tag=false;
  roomForm!:FormGroup;
  @Input() room!: Room;
  @Input() index!:number;
  @Input() currentRate=0;
  selectedRoom!:Room;
 currentValue: number = 100;
 minValue:number=0;
 maxValue:number=5000;

 options:Options={
   floor:0,
   ceil:5000
 };


  constructor(private roomService:RoomServiceComponent) { } 

  

  ngOnInit(): void {
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


  onSubmit(form:NgForm){
    let roomCity='';

    console.log('minV'+this.minValue);
    console.log('maxV'+this.maxValue);
    console.log('currentrate'+this.currentRate);
    const val=form.value;
  //   this.roomForm=new FormGroup({
  //     'city':new FormControl(roomCity)
  // });
  console.log(val.city);
  console.log(val.datein);
  console.log(val.dateout);
  console.log(val.htlfndrdropdown);

  const date=new Date();/*
  let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd');
  console.log(latest_date);*/

  }

}
