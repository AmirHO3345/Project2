import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { arrow } from '@popperjs/core';
import { DataStoragrService, FacilityDetails, reviews } from 'src/app/Ahmad/DataStorageService';
import { PusherService } from 'src/app/Ahmad/pusher.service';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
import { UserModel } from 'src/app/Data_Sharing/Model/user.model';
import { AuthenticationService } from 'src/app/Windows_PopUp/Authentication/authentication.service';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-detailsamir.component.html',
  styleUrls: ['./room-detailsamir.component.css'
  ,'../../../../Fonts/css/animate.min.css',
  '../../../../Fonts/css/bootstrap.min.css','../../../../Fonts/css/menu.css',
  '../../../../Fonts/css/style.css','../../../../Fonts/css/responsive.css',
  '../../../../Fonts/css/fontello/css/icon_set_1.css','../../../../Fonts/css/icon_set_2.css',
  '../../../../Fonts/css/fontello/css/fontello.css','../../../../Fonts/css/magnific-popup.css',
  '../../../../Fonts/css/owl.theme.default.css','../../../../Fonts/css/owl.carousel.css',
  '../../../../Fonts/css/Date_Time_Picker.css','../../../../Home/View_Home/css/style.css']
})
export class RoomDetailsComponentAmir implements OnInit/* ,OnChanges,AfterViewInit,AfterViewChecked */ {

 
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
 AccountUser : UserModel | null
user!:{id:number};
qwer!:string[];
currentDate=new Date();
constructor(private Render : Renderer2,private roomSer:RoomServiceComponent,private ProcessDate:DatePipe,
  private route:ActivatedRoute,private datastorage:DataStoragrService ,
  private AuthService : AuthenticationService) {
    this.check2=false;
  this.AccountUser = null ;
  this.Adults = 1 ;
    this.Rooms = 1 ;
    this.Arrival = {
      IsActive : false ,
      DateDetermine : new Date()
    }
    this.Image_Array = [];
    this.Image_Number = 0;
    this.Mission_Move = <number><unknown>setInterval(()=>this.AutoMove() , 3000);
}
comments:reviews[]=[] ;
bookNow(){
  
  
}
facilityForm!:FormGroup;
private initForm(){
  let arrival='';
  let depture='';
  this.facilityForm=new FormGroup({
    'arrival':new FormControl(arrival),
    'departure':new FormControl(depture)
  })
}
error!:string;
onSubmitBook(){
  if(this.AccountUser==null){
    alert('please login to continue');
  }
  else {
    this.send();
  }
}
check2=false;
send(){
  let Arrival=this.facilityForm.value['arrival'];
  let Depture=this.facilityForm.value['departure'];

  
let dateFr="default";
let dateToo="default";
  let dateFrom:Date;
  let dateTo:Date;  

  
  console.log(Arrival);
  console.log(Depture);
  dateFrom= new Date(Date.parse(Arrival));  
  dateTo=new Date(Date.parse(Depture));  

  
  console.log(dateFr);
  console.log(dateToo);
  
    try{
      if(dateFrom!=undefined && dateTo!=undefined){
        dateFr = <string>this.ProcessDate.transform(dateFrom , "yyyy-MM-dd");
        dateToo = <string>this.ProcessDate.transform(dateTo , "yyyy-MM-dd");
        if(!this.check2){
          this.datastorage.bookNow(dateFr,dateToo,this.roomSer.getRooms()[this.id].id);
      }
    }
    }
    catch(Exception){
  
      if(dateFr=="default"||dateToo=="default"){
        alert('please set a valid date');
      }
      else if(!this.check2){
        console.log(this.id);
        console.log(dateFr);
        console.log(dateToo);
        this.datastorage.bookNow(dateFr,dateToo,this.roomSer.getRooms()[this.id].id);
      }
      
    }
    if(this.check2){
      
      this.datastorage.viewCost(this.roomSer.getRooms()[this.id].id,dateFr,dateToo);
      this.check2=false;
    }
  
  
  console.log(dateFr);
  console.log(dateToo);
}

roomDet!:FacilityDetails;
viewCost(){
  this.check2=true;
  this.datastorage.getComments(this.roomSer.getRooms()[this.id].id);
}
  showError(messeage:string){
  }
  async ngOnInit() {
    this.initForm();
    this.show=false;
    this.comments=[];
this.AuthService.Account.subscribe(Value => {
  this.AccountUser = Value ;
});
    // this.route.params.subscribe(
    // (params:Params)=>{
    //   this.id= +params['id'];  }
    // );
    this.user={
      id:this.route.snapshot.params['id'],
    //  name:this.route.snapshot.params['name']
  };
  console.log(this.user.id);
  let arr:string[]=[];
  arr.push("default");
  this.datastorage.showfacility(this.user.id);
  // this.datastorage.SearchingData("default","default","default",0,1000000,0,arr,0,0,
  // 0,0,0,"=",0,0,0,1);
  //await new Promise(resolve => setTimeout(resolve, 7000));
  // for(let i=0;i<this.roomSer.getRooms().length;i++)
  // {
  //   //if(this.roomSer.getRooms()[i].id==93)
  //   this.roomSer.setroomDet(this.roomSer.getRooms()[i]);
  // }
  //await new Promise(resolve => setTimeout(resolve, 7000));
  //console.log(this.roomSer.getroomDet());
  //this.roomSer.setroomDet(this.roomSer.getRooms()[93]);
  await new Promise(resolve => setTimeout(resolve, 15000));

  this.roomDet=this.roomSer.getroomDet();
  //await new Promise(resolve => setTimeout(resolve, 7000));
  console.log(this.roomDet);

      // console.log("idididi: "+this.id);
      // console.log(this.roomSer.getRooms()[this.id].id);
      // this.room=this.roomSer.getRoomId(this.id);
      // for(let i=0;i<this.roomSer.getRooms()[this.id].photos.length;i++){
      //   this.Image_Array.push(this.roomSer.getRooms()[this.id].photos[i].url);
      //   console.log(this.roomSer.getRooms()[this.id].photos[i].url);
      // }
      this.Image_Array.push("https://img1.10bestmedia.com/Images/Photos/137390/downtown-hotels-overview_55_660x440_201404221801.jpg");
      this.Image_Array.push("https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/05/getty-7.jpg");
      this.Image_Array.push("https://www.bestwestern.com/content/dam/best-western/brand/glo.jpg");
      this.Image_Array.push("https://cdn.businesstraveller.com/wp-content/uploads/fly-images/1024133/TT-Four-Season-916x516.jpg");
  
  //  this.datastorage.getComments(this.roomSer.getRooms()[this.id].id);
     // this.comments=this.roomSer.getReviews();
     
     
  }
  show=false;
  showComment(){
    console.log(this.show);
    this.show=!this.show;
  }
  getroomid(){
    return this.id;
  }

getDateOut(){
  var nextDays = new Date(new Date().setDate(new Date().getDate() + 1)); 
   return  nextDays;
 }


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
check=false;
rateFromUser=0;
onSubmit(ngform:NgForm){
  if(this.AccountUser==null){
    alert('please login to continue');
  }
  else if(!this.deleteCheck){
    const value=ngform.value;
    let comm='';
    comm=value.comment;
    console.log(comm);
    console.log(this.rateFromUser);
    if(this.rateFromUser==0){
      alert('please put a rate');return;
    }
    this.datastorage.setRate(this.roomSer.getRooms()[this.id].id,this.rateFromUser);
    this.datastorage.setComment(this.roomSer.getRooms()[this.id].id,comm);
  }else if(this.deleteCheck){
   let idrev=null;
    for(let i=0;i<this.comments.length;i++){
        if(this.comments[i].id_user==this.AccountUser.ID){
          idrev=this.comments[i].id;console.log(idrev); break;
        }
    }
    if(idrev==null){
      alert('you are not commented');return;
    }
   

    this.datastorage.deleteComment(idrev,this.roomSer.getRooms()[this.id].id);

  }
  

  this.deleteCheck=false;
  this.check=true;
  
}
deleteCheck=false;
DeleteComment(){
  if(this.AccountUser==null){
    alert('please login to continue');
  }
  else {
    this.deleteCheck=true;
  }

}






ngOnDestroy(): void {
  this.comments=[];
}



}