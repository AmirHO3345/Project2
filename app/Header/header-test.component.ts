import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BlockBoxData} from "../Data_Sharing/Model/BlockBox.model";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";
import {UserModel} from "../Data_Sharing/Model/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header-test.component.html',
  styleUrls: ['./header-test.component.css' , '../Fonts/css/font-awesome.css']
})
export class HeaderTestComponent implements OnInit {

  Notification_Array : BlockBoxData[] ;

  Message_Array : BlockBoxData[] ;

  BlockBox_Info !: { Type_Box : string , Info : BlockBoxData[]} ;

  Open_Box : { Type_Icon : boolean | null , IsActive : boolean };

  IsAccountExist : UserModel | null ;

  @ViewChild("MainHeader") MainHeader !: ElementRef ;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event : any) {
    if(window.scrollY > 73)
      this.Render.addClass(this.MainHeader?.nativeElement , 'Slider');
    else
      this.Render.removeClass(this.MainHeader?.nativeElement , 'Slider');
  }

  constructor(private Render : Renderer2 ,private AuthenticationInfo : AuthenticationService) {

    this.Open_Box = { Type_Icon : null , IsActive : false } ;
    this.IsAccountExist = null ;
    this.AuthenticationInfo.Account.subscribe((Data) => {
      if(Data == null)
        this.IsAccountExist = null ;
      else
        this.IsAccountExist = Data;
      // Send Request for fetch notification and message
    })

    this.Notification_Array = [new BlockBoxData(true , "data:image/png;base64,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" , "Amir" , "DDDDD") ,
      new BlockBoxData(true , "iii" , "Amir" , "DDDDD") , new BlockBoxData(true , "iii" , "Amir" , "DDDDD")
      , new BlockBoxData(true , "iii" , "Amir" , "DDDDD") , new BlockBoxData(true , "iii" , "Amir" , "DDDDD")];

    this.Message_Array =  [new BlockBoxData(true , "iii" , "Amir" , "DDDDD") ,
      new BlockBoxData(true , "data:image/png;base64,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" , "Amir" , "DDDDD") , new BlockBoxData(true , "iii" , "Amir" , "DDDDD")
      , new BlockBoxData(true , "iii" , "Amir" , "DDDDD") , new BlockBoxData(true , "iii" , "Amir" , "DDDDD")];
  }

  ngOnInit(): void {
  }

  // True => Notification | False => Message
  public Box_Open(Type_Box : boolean) : void {
    if(this.Open_Box.Type_Icon != null) {
      if (this.Open_Box.IsActive) {
        this.Open_Box.IsActive = false;
        if (this.Open_Box.Type_Icon == Type_Box)
          return;
      }
      setTimeout(() => {
        this.SetBlockBoxInfo(Type_Box);
        this.Open_Box.Type_Icon = Type_Box ;
        this.Open_Box.IsActive = true ;
      }, 100)
    } else {
      this.SetBlockBoxInfo(Type_Box);
      this.Open_Box.Type_Icon = Type_Box ;
      this.Open_Box.IsActive = true ;
    }
  }

  private SetBlockBoxInfo(Type_Box : boolean) : void {
    let Type: string;
    let Data: BlockBoxData[];
    if (Type_Box) {
      Type = "Notification";
      Data = this.Notification_Array;
    } else {
      Type = "Message";
      Data = this.Message_Array;
    }
    this.BlockBox_Info = {Type_Box: Type, Info: Data};
  }

  public OpenRegister() : void {
    this.AuthenticationInfo.PopUpRegisterOpen.next(" ");
  }

}
