import { DatePipe } from '@angular/common';
import {  Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStoragrService, FacilityDetails, FacilityDetailsowner, reviews } from 'src/app/Ahmad/DataStorageService';
import { ListfavsComponent } from 'src/app/Ahmad/favourite-list/listfavs/listfavs.component';
import { Images } from 'src/app/Ahmad/ImagesOfroom.model';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
import { FacilityDetailsOwner } from 'src/app/Ahmad/user-profile/FacilityOwner.model';
import { UserModel } from 'src/app/Data_Sharing/Model/user.model';
import { AuthenticationService } from 'src/app/Windows_PopUp/Authentication/authentication.service';
import { ListOwnerComponent } from '../../../list-owner/list-owner.component';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css'
  ,'../../../../../Fonts/css/animate.min.css',
  '../../../../../Fonts/css/bootstrap.min.css','../../../../../Fonts/css/menu.css',
  '../../../../../Fonts/css/style.css','../../../../../Fonts/css/responsive.css',
  '../../../../../Fonts/css/fontello/css/icon_set_1.css','../../../../../Fonts/css/icon_set_2.css',
  '../../../../../Fonts/css/fontello/css/fontello.css','../../../../../Fonts/css/magnific-popup.css',
  '../../../../../Fonts/css/owl.theme.default.css','../../../../../Fonts/css/owl.carousel.css',
  '../../../../../Fonts/css/Date_Time_Picker.css','../../../../../Home/View_Home/css/style.css'
]
})
export class RoomDetailsComponent3 implements OnInit   {

 
// @ViewChild('Image_Move') Image_View !: ElementRef ;
// Current_Image_Num : number ;
// Mission_Move !: number ;
// Image_Array !: string[] ;
 room!:FacilityDetails;
 favourite!:FacilityDetails;
 facilityowner!:FacilityDetails;
 facilityOwner!:FacilityDetailsOwner;
 user!:{id:number};

check=false;
 id!:number;

 facilityForm!:FormGroup;
 facilityFormbook!:FormGroup;

 Adults !: number ;
 Rooms !: number ;
 Arrival : {IsActive : boolean , DateDetermine : Date} ;
 @ViewChild("Part") DataForm !: NgForm ;
 AccountUser : UserModel | null


qwer!:string[];
currentDate=new Date();

@ViewChildren('Option' , {read : ElementRef}) Element_Images !: QueryList<ElementRef> ;
  Image_Array : string[] ;
  Image_Number : number ;
  Mission_Move : number | null ;
  comments:reviews[]=[] ;

constructor(private ProcessDate:DatePipe,private Render : Renderer2,private roomSer:RoomServiceComponent,
  private route:ActivatedRoute,private router:Router,private listowr:ListOwnerComponent
  ,private datastorage:DataStoragrService,private AuthService : AuthenticationService) {
    this.AccountUser = null ;

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
    
  //  this.Image_Array = [
  //     'https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg',
  //     'https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg',
  //     "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg" ,
  //     "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg" ,
  //     "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg"] ;


    this.Image_Number = 0;
    this.Mission_Move = <number><unknown>setInterval(()=>this.AutoMove() , 3000);
}

removeItem(){
  this.datastorage.removeOwnerFacility(this.user.id); 
  this.roomSer.removeFacilityOwnerItem(this.id);
  this.router.navigate(['../'],{relativeTo:this.route});
}
  async ngOnInit() {let arrival='';
  let depture='';
  this.facilityFormbook=new FormGroup({
    'arrival':new FormControl(arrival),
    'departure':new FormControl(depture)
  })
    this.AuthService.Account.subscribe(Value => {
      this.AccountUser = Value ;
    });
    this.listowr.checkdet=true;
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

  this.facilityowner=this.roomSer.getroomDet();
  console.log(this.facilityowner);
  this.initForm();
  for(let i=0;i<this.facilityowner.photos.length;i++){
    // this.Image_Array.push('https://cf.bstatic.com/xdata/images/hotel/max1280x900/348233595.jpg?k=af53dfa9cd5aa0e1bb0771ed660b3bd197706e03e99f086c2a09ec3035af993c&o=&hp=1');
     //this.Image_Array.push('C:/Users/Ahm/Pictures/qwer.jpg');
     this.Image_Array.push(this.staticPath+this.facilityowner.photos[i].path_photo);
     console.log(this.facilityowner.photos[i].path_photo);
    
   }
  
    this.route.params.subscribe(
    (params:Params)=>{
      this.id= +params['id'];
      console.log("idididi: "+this.id);
      this.roomSer.setIdFacilityOwner(this.id);
      this.roomSer.setCheckOwnerID(true);

      //this.search.tag=true;
      
      let qwer=0;
      for(let i=0;i<this.roomSer.getFacilityOwner()[this.id].photos.length;i++){
       // this.Image_Array.push('https://cf.bstatic.com/xdata/images/hotel/max1280x900/348233595.jpg?k=af53dfa9cd5aa0e1bb0771ed660b3bd197706e03e99f086c2a09ec3035af993c&o=&hp=1');
        //this.Image_Array.push('C:/Users/Ahm/Pictures/qwer.jpg');
        this.Image_Array.push(this.staticPath+this.roomSer.getFacilityOwner()[this.id].photos[i].path_photo);
        console.log(this.roomSer.getFacilityOwner()[this.id].photos[i].path_photo);
        console.log(qwer);
        qwer++;
      }
     // this.Image_Array.push('https://cf.bstatic.com/xdata/images/hotel/max1280x900/348233595.jpg?k=af53dfa9cd5aa0e1bb0771ed660b3bd197706e03e99f086c2a09ec3035af993c&o=&hp=1');


      //this.room=this.roomSer.getRoomId(this.id);
      //this.facilityowner=this.roomSer.getFacilityOwnerId(this.id);
      //if(this.roomSer.getEditItem())
     // this.router.navigate(['../'],{relativeTo:this.route});
     this.initForm();
    }
    );

    
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


myHolidayFilter = (d: Date | null): boolean =>
{


 const time=(d || new Date()).getTime();

  

  
 return !this.myHolidayDates.find(x=>x.getTime()==time);

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
  let Arrival=this.facilityFormbook.value['arrival'];
  let Depture=this.facilityFormbook.value['departure'];

  
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
          console.log("qwer");
          this.datastorage.bookNowOwner(dateFr,dateToo,this.user.id);
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
        this.datastorage.bookNowOwner(dateFr,dateToo,this.user.id);
      }
      
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




checkWIFI=false;
checkingWIFI(){
  this.checkWIFI=!this.checkWIFI;
}

checkTV=false;
checkingTV(){
  this.checkTV=!this.checkTV;
}

checkFridge=false;
checkingFridge(){
  this.checkFridge=!this.checkFridge;
}
checkCoffee=false;
checkingCoffee(){
  this.checkCoffee=!this.checkCoffee;
}
checkAir_cond=false;
checkingAir_cond(){
  this.checkAir_cond=!this.checkAir_cond;
}


ngOnDestroy(): void {
  // clearInterval(this.Mission_Move);
  this.listowr.checkdet=false;
}
editItem(){
  this.check=true;

  //this.router.navigate(['/facilitylist']);
 // this.roomSer.removeFacilityOwnerItem(this.roomSer.getIdFacilityOwner());
  //console.log("edit"+this.roomSer.getIdFacilityOwner());
  
  //this.roomSer.setEditItem(true);
  //this.faclist.check=true;
  console.log("edit");
  
 // this.faclist.Apply();


}
facilityName='';
facilitydescription='';
facilityLocation='';
 facilitytype='';
   facilityRoomNumber=0;
     facilityAdultNumber=0;
     facilityPrice=0;
     wifi=0;
     tv=0;
     cond=0;
     coffee=0;
     fridge=0;
  initForm(){
    console.log('initF');
    
    let imagesPath=new FormArray([]);
    
    

  //  let recipeamount=0;
    //let recipeIngredient=new FormArray([]);
    
    
     // console.log(this.roomService.getIdFacilityOwner());
     console.log(this.facilityowner);
        const facility=this.facilityowner;//this.roomSer.getFacilityOwnerId(this.id);
        this.facilityName=facility.name;
       // facilityimagePath=facility.ImagePath;
       this.facilitydescription=facility.description;
       this.facilityLocation=facility.location;
        this.facilitytype=facility.type;
        this.facilityRoomNumber=facility.num_room;
        this.facilityAdultNumber=facility.num_guest;
        this.facilityPrice=facility.cost;
        // this.wifi=facility.wifi;
        // this.tv=facility.tv;
        // this.cond=facility.air_condition;
        // this.coffee=facility.coffee_machine;
        // this.fridge=facility.fridge;
    this.facilityForm=new FormGroup({
        'name':new FormControl(this.facilityName),
        'location':new FormControl(this.facilityLocation),
        'description':new FormControl(this.facilitydescription),
        'type':new FormControl(this.facilitytype),
        'rooms':new FormControl(this.facilityRoomNumber),
        'adults':new FormControl(this.facilityAdultNumber),
        'cost':new FormControl(this.facilityPrice),
        // 'wifi':new FormControl(this.wifi),
        // 'tv':new FormControl(this.tv),
        // 'coffee_machine':new FormControl(this.coffee),
        // 'air_condition':new FormControl(this.cond),
        // 'fridge':new FormControl(this.fridge)
       // 'type':new FormControl(facilityPrice),
       // 'ingredients':recipeIngredient
       // 'ingredients':recipeIngredient

    });
    //console.log(recipeimagePath);
}

submitted=false;

get controls() { // a getter!
  return (<FormArray>this.facilityForm.get('imagepath')).controls;
}
url!:string|ArrayBuffer|null;

onChange(event: any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      this.url = (<FileReader>event.target).result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }
  console.log(this.url);
}
onDeleteIngredient(index:number)
    {
        (<FormArray>this.facilityForm.get('imagepath')).removeAt(index);
    }

    onAddImage(){
      console.log(this.check);
      (<FormArray>this.facilityForm.get('imagepath')).push(
        new FormGroup({
          'url':new FormControl()
        })
      );
      console.log(this.check);
    }
staticPath=`${DataStoragrService.API_Location}`;
onSubmit(){
  
  let wifi="0";
  let coffe="0";
  let tv="0";
  let fridge="0";
  let air_conditioning="0";
  if(this.checkWIFI)wifi="1";
  if(this.checkCoffee)coffe="1";
  if(this.checkAir_cond)air_conditioning="1";
  if(this.checkTV)tv="1";
  if(this.checkFridge)fridge="1";
  // console.log(this.selectedFile);
  // const fd = new FormData();
  // fd.append('image',this.selectedFile,this.selectedFile.name);
  //console.log(fd);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
          const newfacility=new FacilityDetailsOwner(air_conditioning,
            this.facilityForm.value['name'],
            this.facilityForm.value['location'],
            this.facilityForm.value['description'],
            //this.facilityForm.value['imagepath'],
            this.facilityForm.value['cost'],
            this.facilityForm.value['type'],
            this.facilityForm.value['adults'],
            this.facilityForm.value['rooms'],wifi,coffe,fridge,tv);
////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*const newItem=new FacilityDetailsOwner(this.facilityForm.value['air_condition']
    ,this.facilityForm.value['coffee_machine'],this.facilityForm.value['cost'],
'22-12-2020',this.facilityForm.value['description'],this.facilityForm.value['fridge'],1,5,
this.facilityForm.value['location'],this.facilityForm.value['name'],this.facilityForm.value['adults'],
this.facilityForm.value['rooms'],[
  new Images(1,'val.imagepath')
],1 ,this.facilityForm.value['tv'],this.facilityForm.value['type'],this.facilityForm.value['wifi']
);*/

   // this.roomSer.onUpdateFacilityOwner(this.id,newItem);
    this.check=!this.check;


   
    this.datastorage.updateOwnerFacility(newfacility.name,newfacility.description
      ,newfacility.location,newfacility.type,newfacility.num_room,newfacility.num_guest,
     newfacility.cost,wifi,tv,air_conditioning
     ,coffe,fridge,this.user.id);
this.router.navigate(['../'],{relativeTo:this.route});




}
checkSwitch(){
  this.check=!this.check;
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
      this.Mission_Move =<number><unknown>setInterval(()=>this.AutoMove() , 3000);
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