import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./css/style.css'],
})
export class HomeComponent {

  @ViewChildren('Option' , {read : ElementRef}) Element_Images !: QueryList<ElementRef> ;
  Image_Array : string[] ;
  Image_Number : number ;
  Mission_Move : number | null ;

  constructor(private Render : Renderer2) {
    this.Image_Array = [
      'https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg',
      'https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg',
      "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg" ,
      "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg" ,
      "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg"] ;

    this.Image_Number = 0;
    this.Mission_Move = setInterval(()=>this.AutoMove() , 3000);
  }

  ManualMove(Image_Element : HTMLElement , Image_Number : number , Reset_Mission = true) {
    if(Reset_Mission && this.Mission_Move != null)
      clearInterval(this.Mission_Move);
    if(this.Image_Number == Image_Number)
      return;
    let Current_Image = this.Element_Images.get(this.Image_Number)?.nativeElement;
    let Next_Image = this.Element_Images.get(Image_Number)?.nativeElement;
    this.Image_Number = Image_Number ;
    this.Render.removeClass(Current_Image , "active");
    this.Render.addClass(Next_Image , "active");
    if(Reset_Mission)
      this.Mission_Move = setInterval(()=>this.AutoMove() , 3000);
  }

  private AutoMove() {
    let Next_Number : number ;
    if(this.Image_Number+1 >= this.Element_Images.length)
      Next_Number = 0 ;
    else
      Next_Number = this.Image_Number + 1;
    this.ManualMove(this.Element_Images.get(Next_Number)?.nativeElement , Next_Number , false);
  }
}
