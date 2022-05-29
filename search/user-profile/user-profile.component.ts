import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomServiceComponent } from '../rooms/roomservice.component';
import { User } from '../rooms/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css',
  'style.less','ie.css','font-awesome.min.css','owl.carousel.css','jquery-ui.css']
})
export class UserProfileComponent implements OnInit {

  personalInfo=true;
  settings=false;
   users!:User[];
  @Input() user!: User;
  subscription!:Subscription;



  constructor(private roomService:RoomServiceComponent) { }

  ngOnInit(): void {
    this.subscription= this.roomService.userChanged.subscribe(
      (user:User[])=>{
          this.users=user;
      }
);
  this.users=this.roomService.getUsers();
  }

  personaiInfo(){
      this.personalInfo=true;
      this.settings=false;
  }
  settIngs(){
    this.personalInfo=false;
    this.settings=true;
  }

}
