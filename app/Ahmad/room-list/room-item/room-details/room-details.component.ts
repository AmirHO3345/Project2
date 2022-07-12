import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { FacilityDetails } from 'src/app/Ahmad/DataStorageService';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css'
  ,'../../../../Fonts/css/animate.min.css',
  '../../../../Fonts/css/bootstrap.min.css','../../../../Fonts/css/menu.css',
  '../../../../Fonts/css/style.css','../../../../Fonts/css/responsive.css',
  '../../../../Fonts/css/fontello/css/icon_set_1.css','../../../../Fonts/css/icon_set_2.css',
  '../../../../Fonts/css/fontello/css/fontello.css','../../../../Fonts/css/magnific-popup.css',
  '../../../../Fonts/css/owl.theme.default.css','../../../../Fonts/css/owl.carousel.css',
  '../../../../Fonts/css/Date_Time_Picker.css','../../../../Home/View_Home/css/style.css']
})
export class RoomDetailsComponent implements OnInit   {

 
// @ViewChild('Image_Move') Image_View !: ElementRef ;
// Current_Image_Num : number ;
// Mission_Move !: number ;
// Image_Array !: string[] ;
 room!:FacilityDetails;
 favourite!:FacilityDetails;
 id!:number;

 Adults !: number ;
 Rooms !: number ;
 Arrival : {IsActive : boolean , DateDetermine : Date} ;
 @ViewChild("Part") DataForm !: NgForm ;

 currentRate=0;


 @ViewChildren('Option' , {read : ElementRef}) Element_Images !: QueryList<ElementRef> ;
 Image_Array : string[] ;
 Image_Number : number ;
 Mission_Move : number | null ;

qwer!:string[];
currentDate=new Date();
constructor(private Render : Renderer2,private roomSer:RoomServiceComponent,
  private route:ActivatedRoute,private search:SearchComponent) {
    //for(let i=0;i<this.roomSer.getImages(1).length;i++)
    //this.Image_Array = [this.roomSer.getImages(0)[0],this.roomSer.getImages(1)[1]];
  // this.Current_Image_Num = 1;
  // console.log(`I have apples`);
  this.Adults = 1 ;
    this.Rooms = 1 ;
    this.Arrival = {
      IsActive : false ,
      DateDetermine : new Date()
    }
    this.Image_Array = [];
   /* this.Image_Array = [
      'https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg',
      'https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg',
      "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg" ,
      "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg" ,
      "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg"] ;
*/

    this.Image_Number = 0;
    this.Mission_Move = setInterval(()=>this.AutoMove() , 3000);
}
  ngOnInit() {
    this.route.params.subscribe(
    (params:Params)=>{
      this.id= +params['id'];
      console.log("idididi: "+this.id);
      this.search.tag=true;
      this.room=this.roomSer.getRoomId(this.id);
      //this.favourite=this.roomSer.getFavouriteId(this.id);
      for(let i=0;i<this.roomSer.getRooms()[this.id].photos.length;i++){
        this.Image_Array.push(this.roomSer.getRooms()[this.id].photos[i].url);
        console.log(this.roomSer.getRooms()[this.id].photos[i].url);
      }
      this.Image_Array.push("https://img1.10bestmedia.com/Images/Photos/137390/downtown-hotels-overview_55_660x440_201404221801.jpg");
      this.Image_Array.push("https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/05/getty-7.jpg");
      this.Image_Array.push("https://www.bestwestern.com/content/dam/best-western/brand/glo.jpg");
      this.Image_Array.push("https://cdn.businesstraveller.com/wp-content/uploads/fly-images/1024133/TT-Four-Season-916x516.jpg");

   
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
// ngAfterViewInit(): void {
//   this.Mission_Move = setInterval(()=> {
//     if(this.Current_Image_Num >= this.Image_Array.length)
//       this.Current_Image_Num = 0 ;
//     this.Render.setAttribute(this.Image_View?.nativeElement,'src',
//       this.Image_Array[this.Current_Image_Num]);
//     this.Current_Image_Num++;
//   },5000)
// }


ChangeArrival(CurrentDate : Date ) : void {
  if(this.DataForm.form.value['Departure_D'] != undefined)
        (<AbstractControl>this.DataForm.form.get("Departure_D")).reset();
  if(Date != undefined) {
    this.Arrival = {
      IsActive : true ,
      DateDetermine : new Date(+CurrentDate + (1000*60*60*24))
    };
  } else
    this.Arrival.IsActive = false ;
}


ChangeAdults(Process : boolean) : void {
  if(Process) {
    if(this.Adults + 1 <= 20)
      this.Adults++ ;
  } else {
    if(this.Adults - 1 >= 1)
      this.Adults-- ;
  }
}

ChangeRooms(Process : boolean) : void {
  if(Process) {
    if(this.Rooms + 1 <= 20)
      this.Rooms++ ;
  } else {
    if(this.Rooms - 1 >= 1)
      this.Rooms-- ;
  }
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


onSubmit(ngform:NgForm){
  console.log("comment");
  ngform.onReset();
}






ngOnDestroy(): void {
  // clearInterval(this.Mission_Move);
  this.search.tag=false;
}



}