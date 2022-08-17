import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStoragrService } from '../DataStorageService';
import { RoomServiceComponent } from '../roomservice.component';
import { User } from '../user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css','./bootstrap.min.css',
  'style.less','ie.css','font-awesome.min.css','owl.carousel.css','jquery-ui.css']
})
export class UserProfileComponent implements OnInit {

  personalInfo=true;
  settings=false;
   users=this.roomService.getOtherprofile();;
  @Input() user!: User;
  subscription!:Subscription;



  constructor(private datastorage:DataStoragrService,private roomService:RoomServiceComponent,private route:ActivatedRoute) { }
  check=false;
  ngOnInit(): void {
    
    this.datastorage.showOtherProfile(35);

    //this.users[0].id=this.route.snapshot.params['id'];

//     this.subscription= this.roomService.userChanged.subscribe(
//       (user:User[])=>{
//           this.users=user;
//       }
// );
//   this.users=this.roomService.getUsers();
  }
  call(){
this.check=true;
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
