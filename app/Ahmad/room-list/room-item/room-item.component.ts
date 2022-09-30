import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoragrService, FacilityDetails } from '../../DataStorageService';
import { Room } from '../../room.model';
import { RoomServiceComponent } from '../../roomservice.component';
import { RoomListComponent } from '../room-list.component';
import {UserModel} from "../../../Data_Sharing/Model/user.model";
import {AuthenticationService} from "../../../Windows_PopUp/Authentication/authentication.service";

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
   AccountUser:UserModel|null;
    constructor(private AuthService:AuthenticationService,private datastorage:DataStoragrService
      ,private roomSer:RoomServiceComponent,private router:Router){
      this.AccountUser=null;
    }
  staticPath=`${DataStoragrService.API_Location}`;
  check=true;
    likeSwitch(){
       let id=this.index;
       console.log(id);
      this.datastorage.getFavouriteList();

      if(this.like&&!this.check){
        if(this.AccountUser==null){
          alert('please login to continue');return;
        }
        // removeItem(){
           this.router.navigate(['/search']);

           console.log(this.roomSer.getRooms()[id].id);
           this.datastorage.removeFromFavouriteList(this.roomSer.getRooms()[id].id);
           this.roomSer.removeFavouriteItem(id);
           //this.router.navigate(['/favorite']);
         //  this.router.navigate(['/favourite']);
      }
       console.log(this.roomSer.getRooms()[id].id);
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
ngOnInit(){
      console.log(this.staticPath+this.room.photos[0].path_photo)
      this.AuthService.Account.subscribe(
        Value=>{
          this.AccountUser=Value;
        }
      );
}

giveMeIdFac(){
  console.log(this.roomSer.getRooms()[this.index].id);
  let id=this.roomSer.getRooms()[this.index].id;
  this.router.navigate(['/roomdetails' , id]);
}
}
