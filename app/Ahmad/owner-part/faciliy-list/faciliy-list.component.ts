import { AfterViewChecked, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConsigneeDataModel } from 'src/app/Data_Sharing/Model/ConsigneeData.model';
import { DataStoragrService, FacilityDetailsowner } from '../../DataStorageService';
import { Images } from '../../ImagesOfroom.model';
import { Room } from '../../room.model';
import { RoomServiceComponent } from '../../roomservice.component';
import { FacilityDetailsOwner } from '../../user-profile/FacilityOwner.model';
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

  @Output() facilityOwnerWasSelected=new EventEmitter<FacilityDetailsowner>();
  @Output() facilityOwnerWasSelectedAdd=new EventEmitter<FacilityDetailsOwner>();

  subscription!:Subscription;
  facilityOwners!:FacilityDetailsowner[];
  facilityOwnersAdd!:FacilityDetailsOwner[];
  ItemAdding!:Room;
  check=false;
  AddMode=false;
  id!: number;
  facilityForm!:FormGroup;
  form=this.fb.group({
      lessons:this.fb.array([])
  })


  lessonForm!:FormGroup;
  constructor(private datastorage:DataStoragrService,private fb:FormBuilder,private roomService:RoomServiceComponent,private listown:ListOwnerComponent,private router:Router,private route:ActivatedRoute){}
 // checkk=this.lisyfav.check;

get lesson(){
  return this.form.controls["lessons"] as FormArray;
}

 addLesson(){
    const lessonForm=this.fb.group({
      title:['',Validators.required]
    });
    this.lesson.push(lessonForm);
 }

 private fbb!: FormBuilder;

 private initForm(){
   let facilityName='';
   let desc='';
   let loc='';
   let type='Chalet';
   let roomNum=1;
   let adultNum=1;
   let price=1;
   let imagesPath=new FormArray([]);
   this.facilityForm=new FormGroup({
     'name':new FormControl(facilityName,Validators.required),
     'description':new FormControl(desc,Validators.required),
      'location':new FormControl(loc,Validators.required),
      'type':new FormControl(type,Validators.required),
      'rooms':new FormControl(roomNum,Validators.required),
      'adults':new FormControl(adultNum,Validators.required),
      'cost':new FormControl(price,Validators.required),
      'imagepath':imagesPath
   })
 }
 
 get registerFormControl() {
  return this.facilityForm.controls;
}



  EditMode=this.roomService.getEditItem();

  ngOnInit(){
    this.datastorage.getOwnerFacility();
    this.initForm();
    this.subscription= this.roomService.FacilityownerChanged.subscribe(
        (facilityOwner:FacilityDetailsowner[])=>{
            this.facilityOwners=facilityOwner;
        }
  );
    this.facilityOwners=this.roomService.getFacilityOwner();
    


    this.subscription= this.roomService.FacilityOwnerChanged.subscribe(
      (facilityOwner:FacilityDetailsOwner[])=>{
          this.facilityOwnersAdd=facilityOwner;
      }
);
  this.facilityOwnersAdd=this.roomService.getFacilityOwnerAdd();
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
  
  onfacilityOwnersSelected(facilityOwner:FacilityDetailsowner){
    this.facilityOwnerWasSelected.emit(facilityOwner);
  }

  onfacilityOwnersSelectedAdd(facilityOwner:FacilityDetailsOwner){
    this.facilityOwnerWasSelectedAdd.emit(facilityOwner);
  }
  onAddFacility(){
   // this.roomService.onAddFacilityOwner(this.roomService.getIdFacilityOwner());
  }
  checkSwitch(){console.log(this.check);
    this.check=!this.check;
    console.log(this.check);
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

get controls() { // a getter!
  return (<FormArray>this.facilityForm.get('imagepath')).controls;
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
onDeleteIngredient(index:number)
    {
        (<FormArray>this.facilityForm.get('imagepath')).removeAt(index);
    }


 //selectedFile!:File;   
//  onFileSelected(event: any){
//    this.selectedFile=<File>event.target.files[0];

//   console.log(this.selectedFile); 
// }
url!:string|ArrayBuffer|null;
shortLink: string = "";
loading: boolean = false; // Flag variable
file!: File ; // Variable to store file
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


submitted = false;

   onSubmit()
{
  this.submitted = true;
  this.loading = !this.loading;
  console.log(this.facilityForm.valid);
  if (this.facilityForm.valid) {
    alert('Form Submitted succesfully!!!\n Check the values in browser console.');
    console.table(this.facilityForm.value);
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
    // console.log(this.selectedFile);
    // const fd = new FormData();
    // fd.append('image',this.selectedFile,this.selectedFile.name);
    //console.log(fd);
            const newfacility=new FacilityDetailsOwner(air_conditioning,
              this.facilityForm.value['name'],
              this.facilityForm.value['location'],
              this.facilityForm.value['description'],
              this.facilityForm.value['imagepath'],
              this.facilityForm.value['cost'],
              this.facilityForm.value['type'],
              this.facilityForm.value['adults'],
              this.facilityForm.value['rooms'],wifi,coffe,fridge,tv);
            this.check=!this.check;
            console.log(newfacility);
            this.roomService.onAddFacilityOwner(newfacility);
            this.datastorage.getOwnerFacility();
            console.log('length: '+this.roomService.getFacilityOwnerAdd().length);

            this.datastorage.storeFacilityOwner(newfacility.air_condition
              ,newfacility.name,newfacility.location,newfacility.description,this.url,
              newfacility.cost,newfacility.type,newfacility.num_guest,newfacility.num_room,
              newfacility.wifi,newfacility.coffee_machine,newfacility.fridge,newfacility.tv);
            console.log("kljljl");
           this.initForm();
           this.submitted=false;
  } 

 }
  
 


}
