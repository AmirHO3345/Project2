import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStoragrService, FacilityDetails, reviews } from 'src/app/Ahmad/DataStorageService';
import { PusherService } from 'src/app/Ahmad/pusher.service';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
import { UserModel } from 'src/app/Data_Sharing/Model/user.model';
import { MessageService } from 'src/app/Message/message.service';
import { AuthenticationService } from 'src/app/Windows_PopUp/Authentication/authentication.service';
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
export class RoomDetailsComponent implements OnInit/* ,OnChanges,AfterViewInit,AfterViewChecked */ {


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

 booked:any;

 @ViewChildren('Option' , {read : ElementRef}) Element_Images !: QueryList<ElementRef> ;
 Image_Array : string[] ;
 Image_Number : number ;
 Mission_Move !: number | null ;
 AccountUser : UserModel | null
 roomDet!:FacilityDetails;
qwer!:string[];
showMesseage=false;
currentDate=new Date();
currDate=<string>this.ProcessDate.transform(this.currentDate , "yyyy-MM-dd");
constructor(private Render : Renderer2,private roomSer:RoomServiceComponent,private router:Router
  ,private ProcessDate:DatePipe, public ChatProcess : MessageService ,
  private route:ActivatedRoute/*,private search:SearchComponent*/,private datastorage:DataStoragrService ,
  private AuthService : AuthenticationService) {
    this.check2=false;
    //for(let i=0;i<this.roomSer.getImages(1).length;i++)
    //this.Image_Array = [this.roomSer.getImages(0)[0],this.roomSer.getImages(1)[1]];
  // this.Current_Image_Num = 1;
  // console.log(`I have apples`);
  this.AccountUser = null ;
  this.Adults = 1 ;
    this.Rooms = 1 ;
    this.Arrival = {
      IsActive : false ,
      DateDetermine : new Date()
    }
    this.Image_Array = [];
    console.log(this.roomSer.getRooms());
  /*for(let i=0;i<this.roomSer.getRooms()[this.id].photos.length;i++){
    this.Image_Array.push('http://192.168.43.55:8000/'+this.roomSer.getRooms()[this.id].photos[i].path_photo);
    console.log(this.roomSer.getRooms()[this.id].photos[i].path_photo);
    //console.log(qwer);
   // qwer++;
  }
   /* this.Image_Array = [
      'https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg',
      'https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg',
      "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg" ,
      "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg" ,
      "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg"] ;
*/

    this.Image_Number = 0;
    this.Mission_Move = <number><unknown>setInterval(()=>this.AutoMove() , 3000);
}

//comments!:reviews[];
comments:reviews[]=[] ;
  // ngAfterViewChecked(): void {

  //   console.log('ngAfterViewChecked');
  // }
  // ngAfterViewInit(): void {
  //   console.log('ngAfterViewInit');
  // }
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('ngOnChanges');
  // }
bookNow(){


}
facilityForm!:FormGroup;
FormMes!:FormGroup;
FormRep!:FormGroup;

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
          this.datastorage.bookNow(dateFr,dateToo,this.user.id);
      }
    }
    }
    catch(Exception){

      if(dateFr=="default"||dateToo=="default"){
        alert('please set a valid date');
      }
      else if(!this.check2){
        console.log(this.user.id);
        console.log(dateFr);
        console.log(dateToo);
        this.datastorage.bookNow(dateFr,dateToo,this.user.id);
        console.log("loadding");
        this.LoadbokkListMore();
      }

    }
    if(this.check2){

     
      this.datastorage.viewCost(this.user.id,dateFr,dateToo);
     
      this.check2=false; 

    }


  console.log(dateFr);
  console.log(dateToo);
  // let options = {
  //   headers:new HttpHeaders({"Authorization":this.roomSer.getToken()})
  // };
  // //console.log(id_F);
  // return this.http
  // .post(`${DataStoragrService.API_Location}api/bookings/booking`,
  // {
  //   id_facility:this.roomSer.getRooms()[this.id].id,
  //   start_date:dateFr,
  //   end_date:dateToo
  // },
  //  options
  // )
  // .subscribe((res) => {} , (err) => {
  //   console.log(err);
  //     this.error=err.error['facility']
  //     console.log(this.error);

  // });
}


// cancelBook(){
//   console
//   this.datastorage.displaybooking();
//   // this.datastorage.cancelBook(this.roomSer.getbooking().booking.id
//   // ,this.roomSer.getbooking().booking.id_facility);
// }



myHolidayDates:Date[] = [
  // new Date("12/1/2022"),
  // new Date("12/20/2022"),
  // new Date("12/17/2022"),
  // new Date("12/25/2022"),
  // new Date("12/4/2022"),
  // new Date("12/7/2022"),
  // new Date("12/12/2022"),
  // new Date("12/11/2022"),
  // new Date("12/26/2022"),
  // new Date("12/25/2022")
];


//////////////////////////////////
myFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  return day !== 0 && day !== 6;
};
//////////////////////////////////




rangeFilter(date: Date): boolean {
  let currentDate: Date = new Date();
  let includeDatesWithinNextTwentyDays: boolean =
   date.valueOf() < (currentDate.valueOf() + 20*60*60*1000*24);
  return includeDatesWithinNextTwentyDays;
}
myHolidayFilter = (d: Date | null): boolean =>
{


 const time=(d || new Date()).getTime();

  

  
 return !this.myHolidayDates.find(x=>x.getTime()==time);

    }
// myHolidayFilter 
switchreport=false;
switchReport(){
    this.switchreport=!this.switchreport;
}
onSubmitReport(){

  let Arrival:string =this.FormRep.value['report'];
  console.log(this.user.id);
  this.datastorage.sendReport(this.user.id,Arrival);
  console.log(Arrival);
}
onSubmitMesseage(){

  let Arrival=this.FormMes.value['messeage'];
  console.log(Arrival);
  this.ChatProcess.SendMessage(this.roomDet.id_user, Arrival)
  .subscribe(Value => {
    console.log(Value) ;
  });
  this.router.navigate(['/chat' , this.roomDet.id_user]);

}
switchMesseage(){
  this.showMesseage=!this.showMesseage;
}

user!:{id:number};
viewCost(){
  this.check2=true;
  //this.datastorage.getComments(this.roomSer.getRooms()[this.id].id);
}

  showError(messeage:string){

  }
  async ngOnInit() {
    
console.log(this.myHolidayDates);
    this.initForm();
    let mes='';
  let report='';
  this.FormMes=new FormGroup({
    'messeage':new FormControl(mes)});
    this.FormRep=new FormGroup({
      'report':new FormControl(report)});

    this.show=false;
    this.comments=[];
    // const channel = this.pusher.init('roomservice');
    //     channel.bind('reviews', (data: ConcatArray<reviews>) => {
    //       this.comments = this.comments.concat(data);
    //     });
    //this.datastorage.getComments(this.roomSer.getRooms()[this.id].id);
    // this.facilityForm = this.formBuilder.group({
    //   picker_Arrival: { disabled: true, value: '15' }
    // });
   // alert('please login to continue');
// this.datastorage.SearchingData
// ("default","default","default",0,1000000,0,"default",0,0,
//   0,0,0,"=",0,0,0,1);
this.AuthService.Account.subscribe(Value => {
  this.AccountUser = Value ;
});

this.user={
  id:this.route.snapshot.params['id'],
//  name:this.route.snapshot.params['name']
};
this.datastorage.showfacility(this.user.id);
console.log(this.user.id);
  let arr:string[]=[];
  arr.push("default");
  this.datastorage.showfacility(this.user.id);
  await new Promise(resolve => setTimeout(resolve, 25000));

  this.roomDet=this.roomSer.getroomDet();
  console.log(this.roomDet);
  for(let i=0;i<this.roomDet.photos.length;i++){
    this.Image_Array.push(this.staticPath+this.roomDet.photos[i].path_photo);
    console.log(this.staticPath+this.roomDet.photos[i].path_photo);
  }
    this.route.params.subscribe(
    (params:Params)=>{
      this.id= +params['id']; }  );
    // let staticPath='http://127.0.0.1:8000/';

      // console.log("idididi: "+this.id);
      // console.log(this.roomSer.getRooms()[this.id]);
      // //this.search.tag=true;
      // this.room=this.roomSer.getRoomId(this.id);
      // //this.favourite=this.roomSer.getFavouriteId(this.id);
      
     /* */
    //  this.Image_Array.push("https://img1.10bestmedia.com/Images/Photos/137390/downtown-hotels-overview_55_660x440_201404221801.jpg");
    //   this.Image_Array.push("https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/05/getty-7.jpg");
    //   this.Image_Array.push("https://www.bestwestern.com/content/dam/best-western/brand/glo.jpg");
    //   this.Image_Array.push("https://cdn.businesstraveller.com/wp-content/uploads/fly-images/1024133/TT-Four-Season-916x516.jpg");
    
   
  
    this.datastorage.getComments(this.user.id);
    await new Promise(resolve => setTimeout(resolve, 7000));
      this.comments=this.roomSer.getReviews();
      await new Promise(resolve => setTimeout(resolve, 7000));


      this.datastorage.getBookings(this.user.id);
       await new Promise(resolve => setTimeout(resolve, 10000));
    //  this.roomSer.getbookingList();
      let start='';let endDate='';
      let book=this.roomSer.getbookingList();
      for (let i=0;i<book.length;i++){
        let str=book[i].start_date;
         start=<string>this.ProcessDate.transform(str , "MM-dd-yyyy");
        console.log(start);
       // 
        let end=book[i].end_date;
         endDate=<string>this.ProcessDate.transform(end , "MM-dd-yyyy");
        console.log(endDate);
       // this.myHolidayDates.push(new Date(endDate));
        var startD=Date.parse(start);
        var endD=Date.parse(endDate);
        startD-=86400000;
        endD-=86400000;
        this.myHolidayDates.push(new Date(<string>this.ProcessDate.transform(new Date(startD) ,"MM-dd-yyyy")));
        while(1){
          startD+=86400000;
          var numdate=new Date(startD);
          var startDD=<string>this.ProcessDate.transform(numdate , "MM-dd-yyyy");
          if(startDD==endDate)break;
          this.myHolidayDates.push(new Date(startDD));
          console.log(startDD);
          if(startD>=endD)break;
        }
      }
       // var dd = Date.parse("10-23-2020");
      //  console.log(dd);
      //  dd+=86400000;
       // var numdate=new Date(dd);
    
       // console.log(numdate);
    
        

  }
  show=false;
  showComment(){
    console.log(this.show);
    this.show=!this.show;
  }
  getroomid(){
    return this.user.id;
  }

getDateOut(){
  //console.log(this.currentDate)
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
  async onSubmit(ngform:NgForm){
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
    this.datastorage.setRate(this.user.id,this.rateFromUser);
    await new Promise(resolve => setTimeout(resolve, 7000));
    this.datastorage.setComment(this.user.id,comm);
    await new Promise(resolve => setTimeout(resolve, 7000));

    this.datastorage.getComments(this.user.id);
    await new Promise(resolve => setTimeout(resolve, 7000));
      this.comments=this.roomSer.getReviews();
      await new Promise(resolve => setTimeout(resolve, 7000));
  }else if(this.deleteCheck){
   // this.datastorage.getComments(this.roomSer.getRooms()[this.id].id);
   let idrev=null;
  //  try{
  //       if(this.comments.length==undefined){}

  //  }catch(Exception){alert('you are not commented');return;}
    for(let i=0;i<this.comments.length;i++){
        if(this.comments[i].id_user==this.AccountUser.ID){
          idrev=this.comments[i].id;console.log(idrev); break;
        }
    }
    if(idrev==null){
      alert('you are not commented');return;
    }


    this.datastorage.deleteComment(idrev,this.user.id);

    await new Promise(resolve => setTimeout(resolve, 7000));
    this.datastorage.getComments(this.user.id);
    await new Promise(resolve => setTimeout(resolve, 7000));
    this.comments=this.roomSer.getReviews();


  }


  this.deleteCheck=false;
  this.check=true;

  //ngform.onReset();
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

  async LoadbokkListMore(){
  this.datastorage.getBookings(this.user.id);
  await new Promise(resolve => setTimeout(resolve, 10000));
//  this.roomSer.getbookingList();
 let start='';let endDate='';
 let book=this.roomSer.getbookingList();
 for (let i=0;i<book.length;i++){
   let str=book[i].start_date;
    start=<string>this.ProcessDate.transform(str , "MM-dd-yyyy");
   console.log(start);
  // 
   let end=book[i].end_date;
    endDate=<string>this.ProcessDate.transform(end , "MM-dd-yyyy");
   console.log(endDate);
  // this.myHolidayDates.push(new Date(endDate));
   var startD=Date.parse(start);
   var endD=Date.parse(endDate);
    startD-=86400000;
    endD-=86400000;
   this.myHolidayDates.push(new Date(<string>this.ProcessDate.transform(new Date(startD) ,"MM-dd-yyyy")));
   while(1){
     startD+=86400000;
     var numdate=new Date(startD);
     var startDD=<string>this.ProcessDate.transform(numdate , "MM-dd-yyyy");
     this.myHolidayDates.push(new Date(startDD));
     if(startDD==endDate)break;
     console.log(startDD);
     if(startD>=endD)break;
   }
 }
}


staticPath=`${DataStoragrService.API_Location}`;

ngOnDestroy(): void {
  // clearInterval(this.Mission_Move);
 // this.search.tag=false;
  this.comments=[];
}

GoToProfile(id:number){
  console.log(id);
  this.router.navigate(['/profile' , id]);
}

}
