import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Room } from 'src/search/rooms/room.model';
import { RoomServiceComponent } from 'src/search/rooms/roomservice.component';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css'/*,'./css/animate.min.css','./css/bootstrap.min.css',
'./css/menu.css','./css/responsive.css','./css/fontello/css/icon_set_1.css'
,'./css/fontello/css/icon_set_2.css'
,'./css/fontello/css/fontello.css','./css/magnific-popup.css','./css/DateTimePicker.css',
'./css/owl.carousel.css','./css/owl.theme.default.css'*/]
})
export class RoomDetailsComponent implements AfterViewInit   {

 
@ViewChild('Image_Move') Image_View !: ElementRef ;
Current_Image_Num : number ;
Mission_Move !: number ;
Image_Array !: string[] ;
@Input() room!:Room;
qwer!:string[];
currentDate=new Date();
constructor(private Render : Renderer2,roomSer:RoomServiceComponent) {
  // this.Image_Array = ${this.room.images};
  this.Current_Image_Num = 1;
  console.log(`I have apples`);
}
getDateOut(){
  var nextDays = new Date(new Date().setDate(new Date().getDate() + 1)); 
   return  nextDays;//this.currentDate.setDate( this.currentDate.getDate() + 1 );
 }
ngAfterViewInit(): void {
  this.Mission_Move = setInterval(()=> {
    if(this.Current_Image_Num >= this.Image_Array.length)
      this.Current_Image_Num = 0 ;
    this.Render.setAttribute(this.Image_View?.nativeElement,'src',
      this.Image_Array[this.Current_Image_Num]);
    this.Current_Image_Num++;
  },5000)
}
getphoto(qwer:string[]){

  



}






ngOnDestroy(): void {
  clearInterval(this.Mission_Move);
}



}