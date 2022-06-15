import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FacilityDetails } from '../DataStorageService';
import { Room } from '../room.model';
import { RoomServiceComponent } from '../roomservice.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['../../Data_Sharing/Bootstraps/bootstrap.css','./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  @Output() roomWasSelected=new EventEmitter<FacilityDetails>();
  subscription!:Subscription;
  rooms!:FacilityDetails[];

  
 Adults !: number ;
 Rooms !: number ;

  constructor(private roomService:RoomServiceComponent/*,private router:Router,private route:ActivatedRoute*/){}

  ngOnInit(){
  this.subscription= this.roomService.roomChanged.subscribe(
      (room:FacilityDetails[])=>{
          this.rooms=room;
      }
);
  this.rooms=this.roomService.getRooms();
}
/*
onNewRecipe(){
  this.router.navigate(['new'],{relativeTo:this.route});
}*/
ngOnDestroy(){
  this.subscription.unsubscribe();
}

onRoomSelected(room:FacilityDetails){
  this.roomWasSelected.emit(room);
}
/*
onSelectedRecipe(recipe:Recipe){
  this.wasSelectedRecipe.emit(recipe);
}
*/

}
