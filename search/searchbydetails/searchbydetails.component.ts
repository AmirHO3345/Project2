import { Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider'
import { Room } from '../rooms/room.model';
import { RoomServiceComponent } from '../rooms/roomservice.component';

@Component({
  selector: 'app-searchbydetails',
  templateUrl: './searchbydetails.component.html',
  styleUrls: ['./searchbydetails.component.css']
})
export class SearchbydetailsComponent implements OnInit {
  @Input() room!: Room;
  @Input() currentRate=0;
 currentValue: number = 100;
 options: Options = {
    floor: 0,
    ceil: 200
};

  constructor(private roomService:RoomServiceComponent) { } 
  ngOnInit(): void {
  }
  getCurrentRating(){
    return this.currentRate;
  }
}
