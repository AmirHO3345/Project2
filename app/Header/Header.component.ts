import {Component, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {SideBarComponent} from "./SideBar/SideBar.component";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";
import {UserModel} from "../Data_Sharing/Model/user.model";
import {MatToolbar} from "@angular/material/toolbar";
import {ActivationEnd, Router} from "@angular/router";
import {HomeComponent} from "../Home/View_Home/home.component";
import {NotificationComponent} from "../Notification/notification.component";
import {MessageComponent} from "../Message/message.component";

@Component({
  selector: 'app-header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css']
})
export class HeaderComponent implements OnInit{

  private SideBar !: SideBarComponent ;
  private IsSideBarProcess : boolean ;
  IsAccountExist : UserModel | null ;
  ActiveSide : boolean ;
  SliderVisible : boolean ;
  ActiveIconMessage : boolean ;
  ActiveIconNotification : boolean ;
  @ViewChild(MatToolbar) MainHeader !: MatToolbar
  @ViewChild(SideBarComponent , {static : false}) set SetterSideBar(SideBarCom : SideBarComponent) {
    if (SideBarCom == undefined)
      return ;
    this.SideBar = SideBarCom ;
    setTimeout(() => this.SideBar.OpenSideBar() , 1);
    setTimeout(() => this.IsSideBarProcess = false , 1000);
  }
  @HostListener('window:scroll', ['$event']) onWindowScroll() {}

  constructor(private Render : Renderer2 , private AuthenticationInfo : AuthenticationService ,
              private RouteVariable : Router) {
    this.ActiveSide = false ;
    this.IsSideBarProcess = false ;
    this.IsAccountExist = null ;
    this.SliderVisible = false ;
    this.ActiveIconMessage = true ;
    this.ActiveIconNotification = true ;
  }

  ngOnInit(): void {
    this.AuthenticationInfo.Account.subscribe((Data) => {
      if(this.IsAccountExist != Data)
        if(this.ActiveSide)
          this.CloseSide();
      this.IsAccountExist = Data ;
    });
    this.RouteVariable.events.subscribe(data => {
      if(data instanceof ActivationEnd) {
        if(data.snapshot.component == HomeComponent) {
          this.SliderController();
          this.onWindowScroll = this.SliderController ;
        } else {
          this.onWindowScroll = function () : void {} ;
          this.SliderVisible = true ;
          this.StyleSide();
        }
        this.ActiveIconNotification = data.snapshot.component != NotificationComponent;
        this.ActiveIconMessage = data.snapshot.component != MessageComponent;
      }
    });
  }

  // Just for Home Component
  private SliderController() {
    this.SliderVisible = window.scrollY > 73;
    this.StyleSide();
  }

  private StyleSide() {
    if(this.SliderVisible) {
      if(this.ActiveSide) {
        this.Render.removeClass(this.MainHeader._elementRef.nativeElement , 'SliderOpen');
        this.Render.addClass(this.MainHeader._elementRef.nativeElement , 'SliderShrink');
      } else {
        this.Render.removeClass(this.MainHeader._elementRef.nativeElement , 'SliderShrink');
        this.Render.addClass(this.MainHeader._elementRef.nativeElement , 'SliderOpen');
      }
    } else {
      this.Render.removeClass(this.MainHeader._elementRef.nativeElement , 'SliderShrink');
      this.Render.removeClass(this.MainHeader._elementRef.nativeElement , 'SliderOpen');
    }
  }

  Control_Side() : void {
    if(this.IsSideBarProcess)
      return ;
    if(this.ActiveSide)
      this.CloseSide();
    else {
      this.ActiveSide = true ;
      if(this.SliderVisible) {
        this.Render.removeClass(this.MainHeader._elementRef.nativeElement , 'SliderOpen');
        this.Render.addClass(this.MainHeader._elementRef.nativeElement , 'SliderShrink');
      }
    }
    this.IsSideBarProcess = true ;
  }

  OpenRegister() : void {
    if(this.IsSideBarProcess)
      return ;
    if(this.ActiveSide)
      this.CloseSide();
    this.AuthenticationInfo.PopUpRegisterOpen.next(" ");
  }

  private CloseSide() {
    this.SideBar.CloseSideBar();
    setTimeout(() => {
      this.ActiveSide = false;
      this.IsSideBarProcess = false;
    }, 1000);
    if(this.SliderVisible) {
      this.Render.removeClass(this.MainHeader._elementRef.nativeElement , 'SliderShrink');
      this.Render.addClass(this.MainHeader._elementRef.nativeElement , 'SliderOpen');
    }
  }
}
