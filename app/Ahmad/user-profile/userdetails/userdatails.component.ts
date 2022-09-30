import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/Data_Sharing/Model/user.model';
import { AuthenticationService } from 'src/app/Windows_PopUp/Authentication/authentication.service';
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
  AccountUser : UserModel | null
hide=true;
  @Input() index!:number;
  constructor(private auth:AuthenticationService,private http:HttpClient,private datastorage:DataStoragrService,
    private roomService:RoomServiceComponent,private route:ActivatedRoute,private router:Router) {
      this.AccountUser = null ;
      auth.Account.subscribe((value)=>{
        if(value!=null){
        console.log('logging in');
        console.log(value.GetToken());
        this.accou=value.GetToken();
       // console.log(this.Acount.GetToken());
      }
      })
     }
    
   
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
    await new Promise(resolve => setTimeout(resolve, 15000));
    this.user=this.roomService.getOtherprofile();
    console.log(this.user.user.name);
    this.isLoadingspinner=false;
 this.auth.Account.subscribe(Value => {
      this.AccountUser = Value ;
    });
     if(this.AccountUser==null){
      this.hide=true;
    }
    else if(this.AccountUser.ID==this.userr.id){
      this.hide=false;
    }
//     this.subscription= this.roomService.userChanged.subscribe(
//       (user:User[])=>{
//           this.users=user;
//       }
// );
//   this.users=this.roomService.getUsers();
  }
  staticPath=`${DataStoragrService.API_Location}`;

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
  
  selectedFile!:File;
  async onFileSelected(event: any){
   this.selectedFile=<File>event.target.files[0];
   this.submitPhoto();
   await new Promise(resolve => setTimeout(resolve, 7000));
      this.datastorage.showOtherProfile(this.userr.id);
      await new Promise(resolve => setTimeout(resolve, 7000));
      this.user=this.roomService.getOtherprofile();
 }
 accou!:string;
 submitPhoto(){
   console.log(this.accou);
  let options = {

    headers:new HttpHeaders({"Authorization":this.accou})
 };
  //console.log(this.urll);
  //console.log(this.myForm.value);
 const fd = new FormData();
 fd.append('path_photo',this.selectedFile,this.selectedFile.name);
 console.log(fd);
  return this.http
      .post(`${DataStoragrService.API_Location}api/profile/update`,
      fd,
       options
      )
      .subscribe((res) => {
        console.log(res);
       // alert('your photo submitted successfully');
      //  alert(res.message);
      });
 }

}
