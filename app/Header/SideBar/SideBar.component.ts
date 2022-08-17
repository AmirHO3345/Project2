import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../Windows_PopUp/Authentication/authentication.service";
import {UserModel} from "../../Data_Sharing/Model/user.model";
import { DataStoragrService } from 'src/app/Ahmad/DataStorageService';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './SideBar.component.html',
  styleUrls: ['./SideBar.component.css']
})
export class SideBarComponent implements OnInit{

  UserAccount : UserModel | null ;
  @ViewChild("MainSideBar") MainSide !: ElementRef ;
  @ViewChild("Control") Parts_Control !: ElementRef ;

  accou!:number;
  constructor(private auth:AuthenticationService,private roomser:RoomServiceComponent,private Render : Renderer2 , private AuthenticationInfo : AuthenticationService
    ,private datastorage:DataStoragrService
    ) {
      this.UserAccount = null ;
      auth.Account.subscribe((value)=>{
        if(value!=null){
        console.log('logging in');
        console.log(value.GetToken());
        this.accou=value.ID;
       // console.log(this.Acount.GetToken());
      }
      });
    this.AuthenticationInfo.Account.subscribe((Data) => {
      if(Data != null) {
        this.UserAccount = Data ;
        console.log('logging in');
        console.log(Data.GetToken());
        this.accou=Data.ID;
      }
    });
  }
  myProfile!:number;
  ngOnInit(): void {
    this.myProfile= this.accou;//this.roomser.getIDUser();
  }

  public OpenSideBar() {
    this.Render.removeClass(this.MainSide.nativeElement , "close");
    this.Render.addClass(this.MainSide.nativeElement , "open");
    if(this.Parts_Control != undefined) {
      this.Render.removeClass(this.Parts_Control.nativeElement , "close");
      this.Render.addClass(this.Parts_Control.nativeElement , "open");
    }
  }

  public CloseSideBar() {
    this.Render.removeClass(this.MainSide.nativeElement , "open");
    this.Render.addClass(this.MainSide.nativeElement , "close");
    if(this.Parts_Control != undefined) {
      this.Render.removeClass(this.Parts_Control.nativeElement , "open");
      this.Render.addClass(this.Parts_Control.nativeElement , "close");
    }
  }

  public LogOut() {
    this.AuthenticationInfo.Logout();
  }
 
 // console.log(this.myProfile);  
  getFavouriteList(){
    //this.datastorage.getFavouriteList();
    console.log("qwerqwer");
   // this.dataStorage.getFavouriteList();
  }
}
