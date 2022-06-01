import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit   {

 
@ViewChild('Image_Move') Image_View !: ElementRef ;
Current_Image_Num : number ;
Mission_Move !: number ;
Image_Array !: string[] ;
 room!:Room;
 id!:number;

qwer!:string[];
currentDate=new Date();
constructor(private Render : Renderer2,private roomSer:RoomServiceComponent,
  private route:ActivatedRoute,private search:SearchComponent) {
    //for(let i=0;i<this.roomSer.getImages(1).length;i++)
    //this.Image_Array = [this.roomSer.getImages(0)[0],this.roomSer.getImages(1)[1]];
  this.Current_Image_Num = 1;
  console.log(`I have apples`);
}
  ngOnInit() {
    this.route.params.subscribe(
    (params:Params)=>{
      this.id= +params['id'];
      //console.log("idididi: "+this.id);
      this.search.tag=true;
      this.room=this.roomSer.getRoomId(this.id);

    }
    );
  }
  getroomid(){
    return this.id;
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







ngOnDestroy(): void {
  clearInterval(this.Mission_Move);
  this.search.tag=false;
}



}