import { AfterViewChecked, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConsigneeDataModel } from 'src/app/Data_Sharing/Model/ConsigneeData.model';
import { Images } from '../../ImagesOfroom.model';
import { Room } from '../../room.model';
import { RoomServiceComponent } from '../../roomservice.component';
import { ListOwnerComponent } from '../list-owner/list-owner.component';

@Component({
  selector: 'app-faciliy-list',
  templateUrl: './faciliy-list.component.html',
  styleUrls: ['./faciliy-list.component.css','../../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  '../../room-list/room-item/room-details/room-details.component.css'
  ,'../../../Fonts/css/animate.min.css','../../../Fonts/css/menu.css',
  '../../../Fonts/css/style.css','../../../Fonts/css/responsive.css',
  '../../../Fonts/css/fontello/css/icon_set_1.css','../../../Fonts/css/icon_set_2.css',
  '../../../Fonts/css/fontello/css/fontello.css','../../../Fonts/css/magnific-popup.css',
  '../../../Fonts/css/owl.theme.default.css','../../../Fonts/css/owl.carousel.css',
  '../../../Fonts/css/Date_Time_Picker.css' ]
})
export class FaciliyListComponent implements OnInit,OnDestroy {

  @Output() facilityOwnerWasSelected=new EventEmitter<Room>();
  subscription!:Subscription;
  facilityOwners!:Room[];
  ItemAdding!:Room;
  check=false;
  AddMode=false;
  id!: number;
  facilityForm!:FormGroup;
  

  
  constructor(private roomService:RoomServiceComponent,private listown:ListOwnerComponent,private router:Router,private route:ActivatedRoute){}
 // checkk=this.lisyfav.check;
  EditMode=this.roomService.getEditItem();

  ngOnInit(){
    
    this.subscription= this.roomService.FacilityOwnerChanged.subscribe(
        (facilityOwner:Room[])=>{
            this.facilityOwners=facilityOwner;
        }
  );
    this.facilityOwners=this.roomService.getFacilityOwner();
    
  //   this.route.params.subscribe(
  //     (params:Params)=>{
  //         this.id=+params['id'];
  //         this.EditMode=true;//params['id']!=null;
  //         console.log('edit'+this.EditMode);
  //         this.initForm();
  //      //   console.log("sadadas"+this.editMode);
  //     }
  // );
  }
  /*
  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo:this.route});
  }*/
  ngOnDestroy(){
   //this.initForm();

    //console.log("edit2");
    this.subscription.unsubscribe();
  }
  
  onfacilityOwnersSelected(facilityOwner:Room){
    this.facilityOwnerWasSelected.emit(facilityOwner);
  }
  onAddFacility(){
   // this.roomService.onAddFacilityOwner(this.roomService.getIdFacilityOwner());
    
  }
  checkSwitch(){
    this.check=!this.check;
  }
  checkEdit(){
    
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
 name="kkh";
    //this.ItemAdding.photos[0].url=val.imagepath;
    
loc!:string;
 
  
//   initForm(){
//     console.log(this.roomService.getIdFacilityOwner());
//     let facilityName='';
//     let facilityimagePath='';
//     let facilitydescription='';
//     let facilityLocation='';
//     let facilitytype='';
//     let facilityRoomNumber=0;
//     let facilityAdultNumber=0;
//     let facilityPrice=0;
//     let wifi=0;
//     let tv=0;
//     let cond=0;
//     let coffee=0;
//     let fridge=0;

//   //  let recipeamount=0;
//     //let recipeIngredient=new FormArray([]);
    
//     if(this.EditMode){
//      // console.log(this.roomService.getIdFacilityOwner());
//         const facility=this.roomService.getFacilityOwnerId(1);
//         facilityName=facility.name;
//        // facilityimagePath=facility.ImagePath;
//         facilitydescription=facility.description;
//         facilityLocation=facility.location;
//         facilitytype=facility.type;
//         facilityRoomNumber=facility.num_room;
//         facilityAdultNumber=facility.num_guest;
//         facilityPrice=facility.cost;
//         wifi=facility.wifi;
//         tv=facility.tv;
//         cond=facility.air_condition;
//         coffee=facility.coffee_machine;
//         fridge=facility.fridge;
//         //recipeamount=recipe.description

//     //    for photos Array;
//         // if(facility['ingredients']){
//         //     console.log('hello '+recipe['ingredients']);
//         //     for(let ingred of recipe.ingredients)
//         //     {
//         //         recipeIngredient.push(
//         //             new FormGroup({
//         //                 'name':new FormControl(ingred.name),
//         //                 'amount':new FormControl(ingred.amount,[
//         //                     Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)
//         //                 ])
//         //             })
//         //         );
//         //     }
//         // }
//     }
    
//     this.facilityForm=new FormGroup({
//         'name':new FormControl(facilityName),
//         'location':new FormControl(facilityLocation),
//         'description':new FormControl(facilitydescription),
//         'type':new FormControl(facilitytype),
//         'rooms':new FormControl(facilityRoomNumber),
//         'adults':new FormControl(facilityAdultNumber),
//         'cost':new FormControl(facilityPrice),
//         'wifi':new FormControl(wifi),
//         'tv':new FormControl(tv),
//         'coffee_machine':new FormControl(coffee),
//         'air_condition':new FormControl(cond),
//         'fridge':new FormControl(fridge)
//        // 'type':new FormControl(facilityPrice),
//        // 'ingredients':recipeIngredient
//        // 'ingredients':recipeIngredient

//     });
//     //console.log(recipeimagePath);
// }


   onSubmit(form:NgForm)
{
  
  const val=form.value;
  console.log(val.name);    
    // this.ItemAdding.name="kkh";
    // this.ItemAdding.photos[0].url=val.imagepath;
    // this.ItemAdding.description=val.desc;
    // this.ItemAdding.location=val.location;
    // this.ItemAdding.type=val.type;
    // this.ItemAdding.num_room=val.rooms;
    // this.ItemAdding.num_guest=val.adults;
    // this.ItemAdding.cost=val.cost;
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
    // this.ItemAdding.wifi=wifi;
    // this.ItemAdding.tv=tv;
    // this.ItemAdding.coffee_machine=coffe;
    // this.ItemAdding.air_condition=air_conditioning;
    // this.ItemAdding.fridge=fridge;
    let created_at ="06-06-2023";
    let id=1;
    let id_user=5;
    // this.ItemAdding.photos[0].id=0;
    // this.ItemAdding.created_at=created_at;
    // this.ItemAdding.id=id;
    // this.ItemAdding.id_user=id_user;
   const newItem=new Room(air_conditioning,coffe,val.cost,created_at,val.description
      ,fridge,1,5,val.location,val.name,val.adults,val.rooms,[
      new Images(1,val.imagepath)
    ],tv,val.type,wifi);


//     const newItem=new Room(this.facilityForm.value['air_condition']
//     ,this.facilityForm.value['coffee_machine'],this.facilityForm.value['cost'],
// '22-12-2020',this.facilityForm.value['description'],this.facilityForm.value['fridge'],1,5,
// this.facilityForm.value['location'],this.facilityForm.value['name'],this.facilityForm.value['adults'],
// this.facilityForm.value['rooms'],[
//   new Images(1,'val.imagepath')
// ], this.facilityForm.value['tv'],this.facilityForm.value['type'],this.facilityForm.value['wifi']
// );
            console.log(newItem);
            this.roomService.onAddFacilityOwner(newItem);
            this.check=!this.check;




 
	// created_at : string ;
	// id : number ;
	// id_user : number ;
	// photos : Images[];//{id_photo : number , path_photo : string}[];
	// rate : number ;
  // if(this.EditMode){
    

  //   this.roomService.removeFacilityOwnerItem(this.roomService.getIdFacilityOwner());

  //   this.roomService.onAddFacilityOwner(newItem);
  //   this.check=!this.check;
  //   this.roomService.setEditItem(false);
  // }
  // else{
  //     this.roomService.onAddFacilityOwner(newItem);
  //     this.check=!this.check;
  // }


  // }


 }
// ngAfterViewChecked(): void {
//   if(this.roomService.getCheckOwnerID()){
//     this.initForm();
//     this.roomService.setCheckOwnerID(true);
//     console.log('edit222');
//   }
  
 


}
