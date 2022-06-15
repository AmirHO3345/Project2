import { Component, OnInit } from '@angular/core';
import { FacilityDetails } from './DataStorageService';
import { Room } from './room.model';
import { RoomServiceComponent } from './roomservice.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['../Data_Sharing/Bootstraps/bootstrap.css','./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  selectedRoom!: FacilityDetails;
  constructor(private roomService:RoomServiceComponent){}

  ngOnInit(){
      this.roomService.roomSelected.subscribe(
          (room:FacilityDetails)=>{
              this.selectedRoom=room;
          }
      );
  }
}
