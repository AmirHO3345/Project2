import {Component, Input, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Subject, take} from "rxjs";
import {PopUp_Child, PopUpService} from "../PopUp/Pop-up.service";
import {AuthenticationService} from "./authentication.service";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css' , '../../Fonts/css/font-awesome.css'],
  providers:[{
    provide : PopUpService,
    useExisting : AuthenticationComponent
  }]
})
export class AuthenticationComponent implements PopUp_Child{

  @ViewChild('Auth') Authentication_Info !: NgForm;
  @Input("Type_Window") set Type_Window(Type : boolean) {
    this.Login_View = Type ;
  }
  Login_View : boolean;
  Keep_Login : boolean;
  Authentication_Done !: Subject<any>;

  constructor(private Render : Renderer2 ,
              private AuthenticationProcess : AuthenticationService) {
    this.Login_View = true;
    this.Keep_Login = false;
  }

  /////////////////////////// For Template /////////////////////////////
  ChangeView(LoginElem : HTMLElement , SignUpElem : HTMLElement , State : number) {
    if(State == 1 && !this.Login_View) {
      this.Login_View = true;
      this.Render.removeClass(LoginElem,'nonactive');
      this.Render.addClass(LoginElem,'active');
      this.Render.removeClass(SignUpElem,'active');
      this.Render.addClass(SignUpElem,'nonactive');
    } else if(State == 2 && this.Login_View) {
      this.Login_View = false;
      this.Render.removeClass(SignUpElem,'nonactive');
      this.Render.addClass(SignUpElem,'active');
      this.Render.removeClass(LoginElem,'active');
      this.Render.addClass(LoginElem,'nonactive');
    }
  }

  OnKeepLogin(CheckBox : HTMLElement) {
    this.Keep_Login = !this.Keep_Login;
    if(this.Keep_Login)
      this.Render.addClass(CheckBox,'checkbox-checked');
    else
      this.Render.removeClass(CheckBox,'checkbox-checked');
  }

  ClientOptional(Enable_Client : HTMLElement , Disable_Client : HTMLElement
              , Enable_Input : HTMLElement , Disable_Input : HTMLElement ) {
    this.Render.addClass(Enable_Client , 'radio-checked');
    this.Render.removeClass(Disable_Client , 'radio-checked');
    this.Render.setAttribute(Enable_Input , 'checked' , '');
    this.Render.removeAttribute(Disable_Input , 'checked' , '');
  }

  /////////////////////////// For Program /////////////////////////////

  Send_Close(): Subject<any> {
    this.Authentication_Done = new Subject<any>();
    return this.Authentication_Done;
  }

  OnSubmitForm() {
    let AfterAuth ;
    if(this.Login_View) {
      let GroupF : FormGroup = (<FormGroup>this.Authentication_Info.form.get("Login_Data"));
      let Email = (<FormControl>GroupF.get("L_Email")).value ;
      let Pass = (<FormControl>GroupF.get("L_Password")).value ;
      AfterAuth = this.AuthenticationProcess.Login(Email , Pass , this.Keep_Login);
    } else {
      let GroupF : FormGroup = (<FormGroup>this.Authentication_Info.form.get("SignUp_Data"));
      let UserName = (<FormControl>GroupF.get("S_UserName")).value ;
      let Pass = (<FormControl>GroupF.get("S_Password")).value ;
      let Email = (<FormControl>GroupF.get("S_Email")).value ;
      let Client_Type = ((<FormControl>GroupF.get("Client_Type")).value == "true") ;
      AfterAuth = this.AuthenticationProcess.SignUp(Email , Pass , UserName , Client_Type);
    }

    AfterAuth.pipe(take(1))
      .subscribe((Data) => {
        this.Authentication_Done.next(" ");
      } , (Wrong) => {
        //Make CSS to View Message
      });
  }
}
