import { Component, OnInit } from '@angular/core';
import { Room } from './room.model';
import { RoomServiceComponent } from './roomservice.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  selectedRoom!: Room;
  constructor(private roomService:RoomServiceComponent){}

  ngOnInit(){
      this.roomService.roomSelected.subscribe(
          (room:Room)=>{
              this.selectedRoom=room;
          }
      );
  }
}
