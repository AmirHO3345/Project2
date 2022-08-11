import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FacilityDetailsowner } from 'src/app/Ahmad/DataStorageService';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { FacilityDetailsOwner } from 'src/app/Ahmad/user-profile/FacilityOwner.model';
import { FaciliyListComponent } from '../faciliy-list.component';

@Component({
  selector: 'app-faciliy-item',
  templateUrl: './faciliy-item.component.html',
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
export class FaciliyItemComponent implements OnInit {

  id!:number;
  
  @Input() facilityOwner!: FacilityDetailsowner; //@Input() allows us to bind this comp from outside
  @Input() facilityOwnerAdd!: FacilityDetailsOwner; //@Input() allows us to bind this comp from outside

  @Input() index!:number;
  @Output() facilityOwnerSelected =new EventEmitter<void>();
  constructor(private roomSer:RoomServiceComponent,private router:Router,
    private faclist:FaciliyListComponent,private route:ActivatedRoute) { }
    staticPath='http://192.168.137.247:8000/';
  facilityOwnerNum=this.roomSer.getLenghtFacilityOwner();
  facilityOwners:FacilityDetailsowner[]=this.roomSer.getFacilityOwner();
  facilityOwnersAdd:FacilityDetailsOwner[]=this.roomSer.getFacilityOwnerAdd();

  // removeItem(){
  //   console.log('delete: '+this.roomSer.getIdFacilityOwner())
  //   this.roomSer.removeFacilityOwnerItem(this.roomSer.getIdFacilityOwner());
  // //  this.router.navigate(['/favourite']);
  // }
  editItem(){
    
    //this.router.navigate(['/facilitylist']);
   // this.roomSer.removeFacilityOwnerItem(this.roomSer.getIdFacilityOwner());
    //console.log("edit"+this.roomSer.getIdFacilityOwner());
    
    //this.roomSer.setEditItem(true);
    //this.faclist.check=true;
    console.log("edit");
    
   // this.faclist.Apply();


  }


  ngOnInit(): void {
   
  }
  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  // When the user scrolls down 20px from the top of the document, show the button
scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      //  document.getElementById("myBtn")!.style.display = "block";
    } else {
      //  document.getElementById("myBtn")!.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 

}
