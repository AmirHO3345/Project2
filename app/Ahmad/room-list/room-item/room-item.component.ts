import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FacilityDetails } from '../../DataStorageService';
import { Room } from '../../room.model';
import { RoomListComponent } from '../room-list.component';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['../../../Data_Sharing/Bootstraps/bootstrap.css','./room-item.component.css'
  ,'../../../Fonts/css/animate.min.css',
  '../../../Fonts/css/bootstrap.min.css','../../../Fonts/css/menu.css',
  '../../../Fonts/css/style.css','../../../Fonts/css/responsive.css',
  '../../../Fonts/css/fontello/css/icon_set_1.css','../../../Fonts/css/icon_set_2.css',
  '../../../Fonts/css/fontello/css/fontello.css','../../../Fonts/css/magnific-popup.css',
  '../../../Fonts/css/owl.theme.default.css','../../../Fonts/css/owl.carousel.css',
  '../../../Fonts/css/Date_Time_Picker.css','./room-details/room-details.component.css']
})
export class RoomItemComponent implements OnInit {

  currentRate=0;
   @Input() room!: FacilityDetails; //@Input() allows us to bind this comp from outside
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
