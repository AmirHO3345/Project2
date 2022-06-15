import { Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Room } from '../../room.model';
import { RoomServiceComponent } from '../../roomservice.component';

@Component({
  selector: 'app-searchbydetails',
  templateUrl: './searchbydetails.component.html',
  styleUrls: ['../../../Data_Sharing/Bootstraps/bootstrap.css','./searchbydetails.component.css']
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
