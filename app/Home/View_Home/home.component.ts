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
      'assets/Images/1.jpg',
      'assets/Images/2.jpg',
      "assets/Images/3.jpg" ,
      "assets/Images/4.jpg" ,
      "assets/Images/5.jpg"
    ] ;
    this.Image_Number = 0;
    this.Mission_Move = <number><unknown>setInterval(() => this.AutoMove(), 3000);
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
      this.Mission_Move = <number><unknown>setInterval(()=>this.AutoMove() , 3000);
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
