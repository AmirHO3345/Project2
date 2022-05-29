import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Room } from '../rooms/room.model';
import { RoomServiceComponent } from '../rooms/roomservice.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  @Output() roomWasSelected=new EventEmitter<Room>();
  subscription!:Subscription;
  rooms!:Room[];

  constructor(private roomService:RoomServiceComponent/*,private router:Router,private route:ActivatedRoute*/){}

  ngOnInit(){
  this.subscription= this.roomService.roomChanged.subscribe(
      (room:Room[])=>{
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

onRoomSelected(room:Room){
  this.roomWasSelected.emit(room);
}
/*
onSelectedRecipe(recipe:Recipe){
  this.wasSelectedRecipe.emit(recipe);
}
*/

}
