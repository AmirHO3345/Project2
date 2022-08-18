import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStoragrService, FacilityDetails } from '../../DataStorageService';
import { RoomDetailsComponent } from '../../room-list/room-item/room-details/room-details.component';
import { RoomServiceComponent } from '../../roomservice.component';
import { RoomDetailsComponent2 } from './room-details/room-details.component';

@Component({
  selector: 'app-favourite-page',
  templateUrl: './favourite-page.component.html',
  styleUrls: ['./favourite-page.component.css','../../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  '../../room-list/room-item/room-details/room-details.component.css'
  ,'../../../Fonts/css/animate.min.css','../../../Fonts/css/menu.css',
  '../../../Fonts/css/style.css','../../../Fonts/css/responsive.css',
  '../../../Fonts/css/fontello/css/icon_set_1.css','../../../Fonts/css/icon_set_2.css',
  '../../../Fonts/css/fontello/css/fontello.css','../../../Fonts/css/magnific-popup.css',
  '../../../Fonts/css/owl.theme.default.css','../../../Fonts/css/owl.carousel.css',
  '../../../Fonts/css/Date_Time_Picker.css']
})
export class FavouritePageComponent implements OnInit {

  @Input() favourite!: FacilityDetails; //@Input() allows us to bind this comp from outside
  @Input() index!:number;
  @Output() favouriteSelected =new EventEmitter<void>();
  constructor(private datastorage:DataStoragrService,private roomSer:RoomServiceComponent,private router:Router,private route:ActivatedRoute) { }
  staticPath='http://192.168.43.55:8000/';

  favouriteNum=this.roomSer.getLenghtfavouriteFacilities();
  favouritesFacilities:FacilityDetails[]=this.roomSer.getfavouriteFacilities();
  removeItem(){
    this.router.navigate(['/favorite']);
    let id=this.index;
    console.log(this.roomSer.getfavouriteFacilities()[id].id);
    this.datastorage.removeFromFavouriteList(this.roomSer.getfavouriteFacilities()[id].id);
    this.roomSer.removeFavouriteItem(id);
    //this.router.navigate(['/favorite']);
  //  this.router.navigate(['/favourite']);
  }


  ngOnInit(): void {
  }

}
