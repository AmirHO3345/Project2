import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../Windows_PopUp/Authentication/authentication.service";
import {UserModel} from "../../Data_Sharing/Model/user.model";

@Component({
  selector: 'app-sidebar',
  templateUrl: './SideBar.component.html',
  styleUrls: ['./SideBar.component.css']
})
export class SideBarComponent {

  UserAccount : UserModel | null ;
  @ViewChild("MainSideBar") MainSide !: ElementRef ;
  @ViewChild("Control") Parts_Control !: ElementRef ;

  constructor(private Render : Renderer2 , private AuthenticationInfo : AuthenticationService) {
    this.UserAccount = null ;
    this.AuthenticationInfo.Account.subscribe((Data) => {
      if(Data != null)
        this.UserAccount = Data ;
    });
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
}
