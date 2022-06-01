import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../../room.model';
import { RoomListComponent } from '../room-list.component';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.css']
})
export class RoomItemComponent implements OnInit {

  currentRate=0;
   @Input() room!: Room; //@Input() allows us to bind this comp from outside
   @Input() index!:number;
   @Output() roomSelected =new EventEmitter<void>();
  //  constructor(private roomService:RoomServiceComponent){}




//    onSelected(){
//    this.roomSelected.emit();
//   //  this.roomService.roomSelected.emit(this.room);
// }
GoToDetailsRoomPage(){
  //this.router.navigateByUrl('/room-details');

}
ngOnInit(){}
}
