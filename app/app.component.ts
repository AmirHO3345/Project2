import { Component } from '@angular/core';
import {AuthenticationService} from "./Windows_PopUp/Authentication/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  LoginOpen : boolean ;
  IsLogin !: boolean ;

  constructor(private AuthCheck : AuthenticationService) {
    this.LoginOpen = true ;
    this.AuthCheck.PopUpRegisterOpen.subscribe((Data) => {
      this.LoginOpen = true;
      this.IsLogin = Data ;
    })
  }

  public CloseRegisterWindow() {
    this.LoginOpen = false ;
  }

  ngOnInit() {
    this.AuthCheck.AutoLogin();
  }
}
