import { Component, Input, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { DataStoragrService, MyProfile, OtherProfile } from '../../DataStorageService';
import { RoomServiceComponent } from '../../roomservice.component';
import { User } from '../../user.model';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdatails.component.html',
  styleUrls: ['../../room-list/room-item/room-details/room-details.component.css',
  '../user-profile.component.css',
  '../../../Fonts/css/animate.min.css',
  '../../../Fonts/css/bootstrap.min.css','../../../Fonts/css/menu.css',
  '../../../Fonts/css/style.css','../../../Fonts/css/responsive.css',
  '../../../Fonts/css/fontello/css/icon_set_1.css','../../../Fonts/css/icon_set_2.css',
  '../../../Fonts/css/fontello/css/fontello.css','../../../Fonts/css/magnific-popup.css',
  '../../../Fonts/css/owl.theme.default.css','../../../Fonts/css/owl.carousel.css',
  '../../../Fonts/css/Date_Time_Picker.css','../../../Home/View_Home/css/style.css'
]
})
export class UserDetailsComponent implements OnInit {

  personalInfo=true;
  settings=false;
   user!:OtherProfile;
  //@Input() user!: User;
  subscription!:Subscription;

  userr!:{id:number};

  @Input() index!:number;
  constructor(private datastorage:DataStoragrService,
    private roomService:RoomServiceComponent,private route:ActivatedRoute,private router:Router) { }
  isLoadingspinner=false;
  async ngOnInit() {
    this.passForm=new FormGroup({
      'password':new FormControl('')
    });
    this.isLoadingspinner=true;
     // this.user.user.name='';
    this.userr={
        id:this.route.snapshot.params['id'],
      //  name:this.route.snapshot.params['name']
    };
    console.log(this.userr.id);
    
    this.datastorage.showOtherProfile(this.userr.id);
    await new Promise(resolve => setTimeout(resolve, 7000));
    this.user=this.roomService.getOtherprofile();
    console.log(this.user.user.name);
    this.isLoadingspinner=false;

//     this.subscription= this.roomService.userChanged.subscribe(
//       (user:User[])=>{
//           this.users=user;
//       }
// );
//   this.users=this.roomService.getUsers();
  }

 async onSubmit(ngform:NgForm){
      const value=ngform.value;
      let name:string=value.name;
      let phon:string=value.phone;
      let email:string=value.email;
      let gender:string=value.gender;
      let age:number=value.age;
      this.isLoadingspinner=true;
      console.log(name+' '+phon+' '+email+' '+gender+' '+age);
      this.datastorage.updateProfile(name,email,phon,gender,age);
      await new Promise(resolve => setTimeout(resolve, 7000));
      this.datastorage.showOtherProfile(this.userr.id);
      await new Promise(resolve => setTimeout(resolve, 7000));
      this.user=this.roomService.getOtherprofile();
      this.isLoadingspinner=false;
  }
  passForm!:FormGroup;
  async onSubmitPass(){
    
  let passwo=this.passForm.value['password'];
  this.isLoadingspinner=true;
  this.datastorage.changePassword(passwo);
  await new Promise(resolve => setTimeout(resolve, 7000));
  this.datastorage.showOtherProfile(this.userr.id);
  await new Promise(resolve => setTimeout(resolve, 7000));
  this.user=this.roomService.getOtherprofile();
  this.isLoadingspinner=false;
    console.log(passwo);
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
