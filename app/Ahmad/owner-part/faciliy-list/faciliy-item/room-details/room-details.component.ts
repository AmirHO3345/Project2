import {  Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FacilityDetails } from 'src/app/Ahmad/DataStorageService';
import { ListfavsComponent } from 'src/app/Ahmad/favourite-list/listfavs/listfavs.component';
import { Images } from 'src/app/Ahmad/ImagesOfroom.model';
import { Room } from 'src/app/Ahmad/room.model';
import { RoomServiceComponent } from 'src/app/Ahmad/roomservice.component';
import { SearchComponent } from 'src/app/Ahmad/search/search.component';
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
 facilityowner!:Room;
check=false;
 id!:number;

 facilityForm!:FormGroup;
 Adults !: number ;
 Rooms !: number ;
 Arrival : {IsActive : boolean , DateDetermine : Date} ;
 @ViewChild("Part") DataForm !: NgForm ;


qwer!:string[];
currentDate=new Date();

@ViewChildren('Option' , {read : ElementRef}) Element_Images !: QueryList<ElementRef> ;
  Image_Array : string[] ;
  Image_Number : number ;
  Mission_Move : number | null ;

constructor(private Render : Renderer2,private roomSer:RoomServiceComponent,
  private route:ActivatedRoute,private router:Router,private listowr:ListOwnerComponent) {
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
      this.roomSer.setIdFacilityOwner(this.id);
      this.roomSer.setCheckOwnerID(true);

      //this.search.tag=true;
      this.listowr.checkdet=true;
      for(let i=0;i<this.roomSer.getFacilityOwner()[this.id].photos.length;i++){
        this.Image_Array.push(this.roomSer.getFacilityOwner()[this.id].photos[i].url);
        console.log(this.roomSer.getFacilityOwner()[this.id].photos[i].url);
      }


      //this.room=this.roomSer.getRoomId(this.id);
      this.facilityowner=this.roomSer.getFacilityOwnerId(this.id);
      //if(this.roomSer.getEditItem())
     // this.router.navigate(['../'],{relativeTo:this.route});
     this.initForm();
    }
    );
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

  initForm(){
    console.log('initF');
    let facilityName='';
    let facilityimagePath='';
    let facilitydescription='';
    let facilityLocation='';
    let facilitytype='';
    let facilityRoomNumber=0;
    let facilityAdultNumber=0;
    let facilityPrice=0;
    let wifi=0;
    let tv=0;
    let cond=0;
    let coffee=0;
    let fridge=0;

  //  let recipeamount=0;
    //let recipeIngredient=new FormArray([]);
    
    
     // console.log(this.roomService.getIdFacilityOwner());
        const facility=this.roomSer.getFacilityOwnerId(this.id);
        facilityName=facility.name;
       // facilityimagePath=facility.ImagePath;
        facilitydescription=facility.description;
        facilityLocation=facility.location;
        facilitytype=facility.type;
        facilityRoomNumber=facility.num_room;
        facilityAdultNumber=facility.num_guest;
        facilityPrice=facility.cost;
        wifi=facility.wifi;
        tv=facility.tv;
        cond=facility.air_condition;
        coffee=facility.coffee_machine;
        fridge=facility.fridge;
        //recipeamount=recipe.description

    //    for photos Array;
        // if(facility['ingredients']){
        //     console.log('hello '+recipe['ingredients']);
        //     for(let ingred of recipe.ingredients)
        //     {
        //         recipeIngredient.push(
        //             new FormGroup({
        //                 'name':new FormControl(ingred.name),
        //                 'amount':new FormControl(ingred.amount,[
        //                     Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)
        //                 ])
        //             })
        //         );
        //     }
        // }
    
    
    this.facilityForm=new FormGroup({
        'name':new FormControl(facilityName),
        'location':new FormControl(facilityLocation),
        'description':new FormControl(facilitydescription),
        'type':new FormControl(facilitytype),
        'rooms':new FormControl(facilityRoomNumber),
        'adults':new FormControl(facilityAdultNumber),
        'cost':new FormControl(facilityPrice),
        'wifi':new FormControl(wifi),
        'tv':new FormControl(tv),
        'coffee_machine':new FormControl(coffee),
        'air_condition':new FormControl(cond),
        'fridge':new FormControl(fridge)
       // 'type':new FormControl(facilityPrice),
       // 'ingredients':recipeIngredient
       // 'ingredients':recipeIngredient

    });
    //console.log(recipeimagePath);
}





onSubmit(){
  let wifi=0;
    let coffe=0;
    let tv=0;
    let fridge=0;
    let air_conditioning=0;
    if(this.checkWIFI)wifi=1;
    if(this.checkCoffee)coffe=1;
    if(this.checkAir_cond)air_conditioning=1;
    if(this.checkTV)tv=1;
    if(this.checkFridge)fridge=1;
    let created_at ="06-06-2023";
    let id=1;
    let id_user=5;

    const newItem=new Room(this.facilityForm.value['air_condition']
    ,this.facilityForm.value['coffee_machine'],this.facilityForm.value['cost'],
'22-12-2020',this.facilityForm.value['description'],this.facilityForm.value['fridge'],1,5,
this.facilityForm.value['location'],this.facilityForm.value['name'],this.facilityForm.value['adults'],
this.facilityForm.value['rooms'],[
  new Images(1,'val.imagepath')
], this.facilityForm.value['tv'],this.facilityForm.value['type'],this.facilityForm.value['wifi']
);

    this.roomSer.onUpdateFacilityOwner(this.id,newItem);
    this.check=!this.check;
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