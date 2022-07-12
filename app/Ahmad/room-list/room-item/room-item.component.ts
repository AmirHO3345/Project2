import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoragrService, FacilityDetails } from '../../DataStorageService';
import { Room } from '../../room.model';
import { RoomServiceComponent } from '../../roomservice.component';
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
   like=false;
    constructor(private datastorage:DataStoragrService,private roomSer:RoomServiceComponent,private router:Router){}
  check=true;
    likeSwitch(){ 
      this.datastorage.getFavouriteList();

      this.router.navigate(['/search']);
      this.like=!this.like;
      if(this.like){
        for(let i=0;i<this.roomSer.getfavouriteFacilities().length;i++){
          if(this.roomSer.getfavouriteFacilities()[i].name==this.room.name)this.check=false;
        }
        if(this.check)
        {
          this.roomSer.onAddFavourite(this.room);
          this.datastorage.addToFavouriteList();
        }
        this.check=false;

      }
      else {
        this.roomSer.removeFavouriteItem(this.roomSer.getIdFav());
      }
      //this.roomSer.getfavouriteFacilities()[this.roomSer.getfavouriteFacilities().length-1].id;




    }
    




//    onSelected(){
//    this.roomSelected.emit();
//   //  this.roomService.roomSelected.emit(this.room);
// }
GoToDetailsRoomPage(){
  //this.router.navigateByUrl('/room-details');

}
ngOnInit(){}
}
