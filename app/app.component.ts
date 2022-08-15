import { Component } from '@angular/core';
import {AuthenticationService} from "./Windows_PopUp/Authentication/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  LoginOpen : boolean ;

  constructor(private AuthCheck : AuthenticationService) {
    this.LoginOpen = false ;
    this.AuthCheck.PopUpRegisterOpen.subscribe(() => {
      this.LoginOpen = true;
    });
    this.AuthCheck.Account.subscribe(Value =>{
      // if(Value != null)
      //   console.log(Value.GetType());
    })
  }

  public CloseRegisterWindow() {
    this.LoginOpen = false ;
  }

  ngOnInit() {
    this.AuthCheck.AutoLogin();
  }
}
