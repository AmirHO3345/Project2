import { Component, Injectable, OnInit,EventEmitter, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MessageModel } from '../Data_Sharing/Model/Message.model';
import { UserModel } from '../Data_Sharing/Model/user.model';
import { SearchPartComponent } from '../Home/Search/search-part.component';
import { AuthenticationService } from '../Windows_PopUp/Authentication/authentication.service';
import { addFavourite2, bookList, Error, FacilityDetails, FacilityDetailsowner, idFavo, MyProfile, OtherProfile, reviews } from './DataStorageService';
import { Images } from './ImagesOfroom.model';
import { Comment } from './room-list/room-item/room-details/comment.model';
import { Room } from './room.model';
import { test } from './test.model';
import { FacilityDetailsOwner } from './user-profile/FacilityOwner.model';
import { User } from './user.model';
@Injectable({ providedIn: 'root'})
export class RoomServiceComponent implements OnInit  {
  CheckOwnerID=false;
  Adults !: number ;
  Rooms !: number ;
  id!:number;
  Arriv?:string;
  Depture?:string;
  location!:string;
  check=false;
  private Account : UserModel | null ;
  private approvalStageMessage = new BehaviorSubject('Basic Approval is required!');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  currentDate = new Date();

    roomChanged=new Subject<FacilityDetails[]>();
    favouriteFacilitiesChanged=new Subject<FacilityDetails[]>();
    FacilityOwnerChanged=new Subject<FacilityDetailsOwner[]>();
    FacilityownerChanged=new Subject<FacilityDetailsowner[]>();
    roomSelected=new EventEmitter<Room>();
    userChanged=new Subject<User[]>();
    userSelected=new EventEmitter<User>();
    //private rooms:Room[]=[];
    @Input() images!:string[];
   private users:User[]=[
      new User(1,"ahmad","ex@gmail.com","sada213"),
      new User(1,"mhmd","qwer@gmail.com","sada213"),
      new User(1,"qwer","ex@gmail.com","sada213"),
      new User(1,"asdf","ex@gmail.com","sada213"),
  ];
   private favouriteFacilities:FacilityDetails[]=[];
   private FacilityOwner:FacilityDetailsOwner[]=[];
   private getFacilityowner:FacilityDetailsowner[]=[];
   private rooms:FacilityDetails[]=[];
ngOnInit(): void {
  
}

constructor(){
  this.Account=null;
}
updateApprovalMessage(message: string) {
  this.approvalStageMessage.next(message);
  }

  setSendToSearch(loc:string,arrival:string|undefined,depreture:string|undefined,adult:number,check:boolean){
    this.location=loc;
    this.Arriv=arrival;
    this.Depture=depreture;
    this.Adults=adult;
    this.check=check;
  }
  setCheck(check:boolean){
    this.check=check;
  }
  getCheck(){
    return this.check;
  }
  
  getAdults(){
    return this.Adults;
  }
  getArrival(){
    return this.Arriv;
  }
  getDept(){
    return this.Depture;
  }
  getLoc(){
    return this.location;
  }


getUsers(){
  return this.users.slice();
}
getRooms(){
    return this.rooms.slice();
}getImages(index:number){
 // return this.rooms[index].images;

  //return this.images;
}
getRoomId(index:number){
    return this.rooms[index];
  }
  roomRate:FacilityDetails[]=[];

  getRoomsByRating(rate:number){

    let j=0;
    for(let i=0; i<this.rooms.length;i++){

      if(this.rooms[i].rate===rate){
        this.roomRate[j]=this.rooms[i];console.log("qwer");
        j++;
      }
      
      //this.roomRate[i]=this.rooms[i];
      //console.log(data.products[i].product_desc); //use i instead of 0
    }
  return this.roomRate.slice();
}

getRoomsNuber(){
  return this.rooms.length;
}
/////////////////////////////Favourites//////////////////////////////////////

setfavouriteFacilities(favouriteFacilities:FacilityDetails[]){
  this.favouriteFacilities=favouriteFacilities;
  this.favouriteFacilitiesChanged.next(favouriteFacilities.slice());
}/*
this.rooms=rooms;
console.log(rooms.length);
this.roomChanged.next(rooms.slice());*/
qwer:idFavo[]=[];


setQwer(qwer:idFavo[]){
  
  this.qwer=qwer;
  
}

getQwer(){
  return this.qwer;
}

getfavouriteFacilities(){

//   this.qwer=new this.qwer(new string[

//   ])
 
  
  
  


//   this.qwer.push();


//  this.setQwer(this.qwer);
  console.log("hiii");
  console.log(this.favouriteFacilities);
  
 // if(this.favouriteFacilities.length>0)
  return this.favouriteFacilities.slice();
  //else return this.rooms.slice();
}

getLenghtfavouriteFacilities(){
  return this.favouriteFacilities.length;
}
onAddFavourite(Favourite:FacilityDetails){
  
  this.favouriteFacilities.push(Favourite);
  this.favouriteFacilitiesChanged.next(this.favouriteFacilities.slice());

  //console.log(this.favouriteFacilities);
  //this.getfavouriteFacilities();
}
fav!:addFavourite2;

getFavouriteId(index:number){
  return this.favouriteFacilities[index];
}
removeFavouriteItem(index:number){
  this.favouriteFacilities.splice(index,1);
  this.favouriteFacilitiesChanged.next(this.favouriteFacilities.slice());
}
setIdFav(id:number){
  this.id=id;
}
getIdFav(){
  return this.id;
}
token!:string;
setToken(token:string){
  this.token=token;
}
getToken(){
  return this.token;
}
//////////////////////////////////////////////////////////////////////////////


getTest(){
  return this.qwer.slice();
}



////////////////////////////////FacilityOwner////////////////////////////////////////////

setFacilityOwner(FacilityOwner:FacilityDetailsowner[]){
  this.getFacilityowner=FacilityOwner;
  this.FacilityownerChanged.next(FacilityOwner.slice());
}

getFacilityOwner(){
  console.log("hiii");
  console.log(this.getFacilityowner);
 // if(this.favouriteFacilities.length>0)
  return this.getFacilityowner.slice();
  //else return this.rooms.slice();
}

getFacilityOwnerAdd(){
  console.log("hiii");
  console.log(this.FacilityOwner);
 // if(this.favouriteFacilities.length>0)
  return this.FacilityOwner.slice();
  //else return this.rooms.slice();
}
getLenghtFacilityOwner(){
  return this.FacilityOwner.length;
}
onAddFacilityOwner(FacilityOwner:FacilityDetailsOwner){
  console.log("adding");
  this.FacilityOwner.push(FacilityOwner);
  this.FacilityOwnerChanged.next(this.FacilityOwner.slice());
  console.log("Added");
  //console.log(this.favouriteFacilities);
  //this.getfavouriteFacilities();
}
getFacilityOwnerId(index:number){
  return this.getFacilityowner[index];
}
removeFacilityOwnerItem(index:number){
  this.getFacilityowner.splice(index,1);
  this.FacilityownerChanged.next(this.getFacilityowner.slice());
}
setIdFacilityOwner(id:number){
  this.id=id;
}
getIdFacilityOwner(){
  return this.id;
}
editMode=false;
setEditItem(editMode:boolean){
  this.editMode=editMode;
}

getEditItem(){
  return this.editMode;
}
onUpdateFacilityOwner(index:number,newFacilityOwner:FacilityDetailsOwner){
  this.FacilityOwner[index]=newFacilityOwner;
  this.FacilityOwnerChanged.next(this.FacilityOwner.slice());
  
}
setCheckOwnerID(CheckOwnerID:boolean){
  this.CheckOwnerID=CheckOwnerID;
}

getCheckOwnerID(){
 return this.CheckOwnerID;
}

//////////////////////////////////////////////////////////////////////////
  /*
  addIngredientsToShoppngList(ingred:ingredient[])
  {
        this.shoppinglistservice.addIngredients(ingred);
  }*/
  onAddRooms(room:FacilityDetails[]){
     /* this.rooms.push(room);
      this.roomChanged.next(this.rooms.slice());
*/

      for(let i=0;i<room.length;i++){
        this.rooms.push(room[i]);
        this.roomChanged.next(this.rooms.slice());
      }

      
  }
  onUpdateRoom(index:number,newRoom:FacilityDetails){
        this.rooms[index]=newRoom;
        this.roomChanged.next(this.rooms.slice());

  }
 

  setRooms(rooms:FacilityDetails[]){
    this.rooms=rooms;
    console.log(rooms.length);
    this.roomChanged.next(rooms.slice());
    console.log(rooms);

   // Array.isArray(set) ? set.slice(2) : [];
    //console.log(this.rooms);
    //console.log("dsfsdf   "+this.rooms.length);
  }
  bookingChanged=new Subject<Error>();

  private booking !:Error;
  setbooking(booking:Error){
    this.booking=booking;
    console.log(booking);
  }

  getbooking(){
    return this.booking;
  }

  private bookList !:bookList[];
  setbookingList(bookList:bookList[]){
    this.bookList=bookList;
    console.log(this.bookList);
  }

  private reviews !:reviews[];
  private reviewsChanged =new Subject<reviews[]>();
  setReviews(reviews:reviews[]){
    this.reviews=reviews;
    this.reviewsChanged.next(reviews.slice());
    console.log(reviews);
  }
  getReviews(){
    return this.reviews;
  }

  private myprof!:MyProfile;
 // private myprofChanged =new Subject<MyProfile>();
  setMyprofile(myprof:MyProfile){
    this.myprof=myprof;
    //this.myprofChanged.next(myprof.slice());
    console.log(myprof);
  }
  getMyprofile(){
   return this.myprof;
  }

  private Otherprof!:OtherProfile;
  // private myprofChanged =new Subject<MyProfile>();
   setOtherprofile(Otherprof:OtherProfile){
     this.Otherprof=Otherprof;
     //this.myprofChanged.next(myprof.slice());
     console.log(Otherprof);
   }
   getOtherprofile(){
    return this.Otherprof;
   }
    idUser!:number;

   setIDUser(id:number){
     this.idUser=id;
   }
   getIDUser(){
     return this.idUser;
   }

   private roomDet!:FacilityDetails;
   setroomDet(id:FacilityDetails){
     this.roomDet=id;
     console.log(this.roomDet);
   }
   getroomDet(){
     return this.roomDet;
   }

}
