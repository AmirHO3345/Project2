import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  constructor(private http:HttpClient,private datastorage:DataStoragrService,private fb:FormBuilder,private roomService:RoomServiceComponent,private listown:ListOwnerComponent,private router:Router,private route:ActivatedRoute){}
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
 images : string[] = [];
 private initForm(){
   let facilityName='';
   let desc='';
   let loc='';
   let type='chalet';
   let roomNum=1;
   let adultNum=1;
   let price=1;
   let imagesPath=new FormArray([]);
   this.facilityForm=new FormGroup({
     'name':new FormControl(facilityName,Validators.required),
     'photo_list': new FormControl([], [Validators.required]),
     'description':new FormControl(desc,Validators.required),
      'location':new FormControl(loc,Validators.required),
      'type':new FormControl(type,Validators.required),
      'num_room':new FormControl(roomNum,Validators.required),
      'num_guest':new FormControl(adultNum,Validators.required),
      'cost':new FormControl(price,Validators.required)
      
   })
 }
 
 get registerFormControl() {
  return this.facilityForm.controls;
}
onFileChange(event:any) {
  if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
              var reader = new FileReader();
  
              reader.onload = (event:any) => {
                console.log(event.target.result);
                 this.images.push(event.target.result);
                 this.facilityForm.patchValue({
                  photo_list: this.images
                 });
              }
 
              reader.readAsDataURL(event.target.files[i]);
      }
  }
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


 Images: any;
 multipleImages=[];
 selectMultipleImages(event:any){
    if(event.target.files.length>0){
      console.log(event);
      this.multipleImages=event.target.files;
      //this.Images=file;
    }
 }
   async onSubmit()
{
  this.submitted = true;
  this.loading = !this.loading;
  console.log(this.facilityForm.valid);
  if (this.facilityForm.valid) {
    alert('Form Submitted succesfully!!!\n Check the values in browser console.');
    console.table(this.facilityForm.value);
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

    let fd = new FormData();
    let fileData:FormData[]=[];
    // for(let i=0;i<this.selectedFiles.length;i++){
    //  fd.append('photo_list[]',this.selectedFiles[i],this.selectedFiles[i].name);
    //  console.log(fd);
    //  fileData.push(fd);
    // }
    for (let i = 0; i <this.selectedFiles.length; i++) {
     fd.append('photo_list['+i+']',this.selectedFiles[i],this.selectedFiles[i].name);
     fileData.push(fd);
    }
    
    //fd.append('photo_list[]',this.selectedFiles[0],this.selectedFiles[0].name);
    //console.log(fd);
    //console.log(fileData[2]);
            const newfacility=new FacilityDetailsOwner(air_conditioning,
              this.facilityForm.value['name'],
              this.facilityForm.value['location'],
              this.facilityForm.value['description'],
              
              123,
              this.facilityForm.value['type'],
              this.facilityForm.value['num_guest'],
              this.facilityForm.value['num_room'],wifi,coffe,fridge,tv);
            this.check=!this.check;
            console.log(newfacility);
            this.datastorage.storeFacilityOwner(air_conditioning,this.facilityForm.value['name'],
            this.facilityForm.value['location'],
            this.facilityForm.value['description'],fd,
            this.facilityForm.value['cost'],
              this.facilityForm.value['type'],
              this.facilityForm.value['num_guest'],
              this.facilityForm.value['num_room'],wifi,coffe,fridge,tv);
              await new Promise(resolve => setTimeout(resolve, 2000));
              this.roomService.getFacilityOwner();
      /*    
       console.log(this.facilityForm.value);
       let queryParams = new HttpParams();
       queryParams = queryParams.append("air_condition","1");
       queryParams = queryParams.append("name","loc");
       queryParams = queryParams.append("location","loc");
       queryParams = queryParams.append("description","loc");
       queryParams = queryParams.append("cost",123);
       queryParams = queryParams.append("type","chalet");
       queryParams = queryParams.append("num_guest",3);
       queryParams = queryParams.append("num_room",5);
       queryParams = queryParams.append("wifi","1");
       queryParams = queryParams.append("fridge","1");
       queryParams = queryParams.append("tv","1");
       queryParams = queryParams.append("coffee_machine","0");
       
          this.http
         .post(`${DataStoragrService.API_Location}api/facility/store`,
          fd,
          {
            headers:new HttpHeaders({"Authorization":"Bearer 499|9fQ98W2oC1N0UTvvlcBISeudLPVSeJSn2woCqBUJ"})
           ,params:queryParams
          }
         )
         .subscribe((res) => console.log(res));*/
     //    let q=this.facilityForm.value;
       //console.log(this.facilityForm.value);
         
           this.initForm();
           this.submitted=false;
  } 

 }
  

  selectedFile!:File;
 onfileSelected(event: any){
   this.selectedFile=<File>event.target.files[0];
 }

 
 selectedFiles:File[]=[];
 onfilesSelected(event: any){
   for(let i=0;i<event.target.files.length;i++){
    this.selectedFiles.push(<File>event.target.files[i]);
   }




   //this.selectedFile=<File>event.target.files[0];
 }

 
  qwerNew(){
    let options = {
      headers:new HttpHeaders({"Authorization":"Bearer 499|9fQ98W2oC1N0UTvvlcBISeudLPVSeJSn2woCqBUJ"})
   };
    //console.log(this.urll);
    //console.log(this.myForm.value);
   const fd = new FormData();
   fd.append('path_photo',this.selectedFile,this.selectedFile.name);
   console.log(fd);
    return this.http
        .post(`${DataStoragrService.API_Location}api/profile/update`,
        fd,
         options
        )
        .subscribe((res) => {
          console.log(res);
          alert('your information submitted successfully');
        //  alert(res.message);
        });
  }
}
