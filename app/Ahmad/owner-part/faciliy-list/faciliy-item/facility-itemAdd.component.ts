import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FacilityDetailsowner } from 'src/app/Ahmad/DataStorageService';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { FacilityDetailsOwner } from 'src/app/Ahmad/user-profile/FacilityOwner.model';
import { FaciliyListComponent } from '../faciliy-list.component';

@Component({
  selector: 'app-faciliy-itemAdd',
  templateUrl: './facility-itemAdd.component.html',
  styleUrls: ['./faciliy-item.component.css','../../../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  '../../../room-list/room-item/room-details/room-details.component.css'
  ,'../../../../Fonts/css/animate.min.css','../../../../Fonts/css/menu.css',
  '../../../../Fonts/css/style.css','../../../../Fonts/css/responsive.css',
  '../../../../Fonts/css/fontello/css/icon_set_1.css','../../../../Fonts/css/icon_set_2.css',
  '../../../../Fonts/css/fontello/css/fontello.css','../../../../Fonts/css/magnific-popup.css',
  '../../../../Fonts/css/owl.theme.default.css','../../../../Fonts/css/owl.carousel.css',
  '../../../../Fonts/css/Date_Time_Picker.css']
})
export class FaciliyItemComponentAdd {

    @Input() facilityOwnerAdd!: FacilityDetailsOwner; //@Input() allows us to bind this comp from outside

    @Input() indexAdd!:number;
    @Output() facilityOwnerSelected =new EventEmitter<void>();
    constructor(private roomSer:RoomServiceComponent,private router:Router,
      private faclist:FaciliyListComponent,private route:ActivatedRoute) { }
      facilityOwnerNum=this.roomSer.getLenghtFacilityOwner();
      facilityOwnersAdd:FacilityDetailsOwner[]=this.roomSer.getFacilityOwnerAdd();

 
  }
  // When the user scrolls down 20px from the top of the document, show the button



