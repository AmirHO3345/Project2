import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { Room } from './rooms/room.model';
import { RoomServiceComponent } from './rooms/roomservice.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  currentDate = new Date();
 
  @Input() room!: Room;
  @Input() index!:number;
  @Input() currentRate=0;
  value:number=100;
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

}
