import { Component, Injectable, OnInit,EventEmitter, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SearchPartComponent } from '../Home/Search/search-part.component';
import { addFavourite2, FacilityDetails, idFavo } from './DataStorageService';
import { Images } from './ImagesOfroom.model';
import { Comment } from './room-list/room-item/room-details/comment.model';
import { Room } from './room.model';
import { test } from './test.model';
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
 
  private approvalStageMessage = new BehaviorSubject('Basic Approval is required!');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  currentDate = new Date();

    roomChanged=new Subject<FacilityDetails[]>();
    favouriteFacilitiesChanged=new Subject<FacilityDetails[]>();
    FacilityOwnerChanged=new Subject<Room[]>();
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
   //currentDate=new Date();
   private favouriteFacilities:FacilityDetails[]=[];
   private FacilityOwner:Room[]=[
     new Room(1,1,1200,'12-12-2002','soo beauty',1,3,5,'damas','ahm fac',3,5,
     [
       new Images(1,
'https://offloadmedia.feverup.com/secretneworleans.co/wp-content/uploads/2021/03/10101834/Webp.net-resizeimage-46-1024x597.jpg'
    ),
    new Images(1,
      'moneyinc.com/wp-content/uploads/2016/09/Four-Seasons-Las-Vegas-750x422.jpg'
          ),new Images(1,
            'https://digital.ihg.com/is/image/ihg/staybridge-suites-seattle-4079661105-4x3'
                ),
],1,'chalet',0),
     new Room(1,1,12020,'12-12-2012','soo beauty',1,3,5,'damas','ahm fac',3,5,
     [
       new Images(1,
'https://img1.10bestmedia.com/Images/Photos/137390/downtown-hotels-overview_55_660x440_201404221801.jpg'
     ),
     new Images(1,
      'https://cf.bstatic.com/xdata/images/hotel/max1024x768/22443294.jpg?k=fc9d8a13beb15e92eb0479d21af7e66ae55f8da78f5b45b1b63a2937a52fb3d0&o=&hp=1'
           ),
           new Images(1,
'https://www.insidehook.com/wp-content/uploads/2021/09/Novotel-Ahmedabad-Hotel.png?fit=1200%2C800'
     ), new Images(1,
      'https://digital.ihg.com/is/image/ihg/staybridge-suites-seattle-4079661105-4x3'
           ),
           new Images(1,
            'https://offloadmedia.feverup.com/secretneworleans.co/wp-content/uploads/2021/03/10101834/Webp.net-resizeimage-46-1024x597.jpg'
                 ),
                 new Images(1,
      'https://cdn.businesstraveller.com/wp-content/uploads/fly-images/1024133/TT-Four-Season-916x516.jpg'
           ) ,new Images(1,
            'https://www.bestwestern.com/content/dam/best-western/brand/glo.jpg'
                 ),
                 new Images(1,
                  'data:image/jpeg;base64,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'
                       ),
                       new Images(1,
            'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/05/getty-7.jpg'
                 )],1,'chalet',0)
   ];
   private rooms:FacilityDetails[]=[
      //   new Room(1,1,'Four Seasons Chalet','Damas','soo beauty','chalet',350,3,3,2,
      //   1,1,1,1,1
      //   ,this.currentDate,
      //  // 'https://offloadmedia.feverup.com/secretneworleans.co/wp-content/uploads/2021/03/10101834/Webp.net-resizeimage-46-1024x597.jpg'
      //   this.currentDate, 
      //   [
      //     new Images(1,'https://offloadmedia.feverup.com/secretneworleans.co/wp-content/uploads/2021/03/10101834/Webp.net-resizeimage-46-1024x597.jpg')
      //   ]
      //   // [
      //   //   new Comment("the hotel soo bad",3,"Ahmad Ghm",this.currentDate,"c:\photo1.jpg"),
      //   //  // new Comment("the hotel soo good",3,"mhmd amr",this.currentDate)
      //   // ],
      //   // this.images=[
      //   //     "https://img1.10bestmedia.com/Images/Photos/137390/downtown-hotels-overview_55_660x440_201404221801.jpg"
      //   // ],
      //   //   [
      //   //      new ServicesModel(1,1,1,1,1)
      //   //   ]
      // //  ,4,210,'dsfsdf',4,4,'dsfsdf',,
       
        
          
        
       
      // )
//    ,new Room('Ramsis hostel','sea of desert',
//    'https://moneyinc.com/wp-content/uploads/2016/09/Four-Seasons-Las-Vegas-750x422.jpg'
//   ,5,125
//   ,'damas',3,5,'shalet',
//   [
//     new Comment(" soo bad",2,"ansa",this.currentDate,"c:\photo1.jpg"),
//     new Comment("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a lorem quis neque interdum consequat ut sed sem. Duis quis tempor nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus",5,"fad amr",this.currentDate,"c:\photo1.jpg"),
//     new Comment("the hotel soo good",3,"mhmd amr",this.currentDate,"c:\photo1.jpg")
//   ],
  
//     this.images=[
//       "https://media.cntraveler.com/photos/5da87c95040bc900083f500e/master/w_4000,h_2703,c_limit/Hotel-Theodore_2019_HotelTheodore-2.jpg",
//       "https://digital.ihg.com/is/image/ihg/staybridge-suites-seattle-4079661105-4x3",
//       "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_470,q_65,w_640/v1/clients/wilmingtonnc/ff2c5ff3_70de_445b_a001_29b51aa8dec6_81ccd151-7cb3-4f33-a9b6-431bbaef4009.jpg"
//     ]
        
//   ),new Room('Pour Qoui Resort','big tower awasome',
//    'https://cdn.businesstraveller.com/wp-content/uploads/fly-images/1024133/TT-Four-Season-916x516.jpg'
//   ,2,75,'dsfsdf',4,4,'dsfsdf',
//   [
//     new Comment("wow",3,"amer",this.currentDate,"c:\photo1.jpg"),
//     new Comment("baaad",1,"moner",this.currentDate,"c:\photo1.jpg")
//   ],
//   this.images=[
//     "https://cf.bstatic.com/xdata/images/hotel/max1024x768/22443294.jpg?k=fc9d8a13beb15e92eb0479d21af7e66ae55f8da78f5b45b1b63a2937a52fb3d0&o=&hp=1",
//     "https://www.insidehook.com/wp-content/uploads/2021/09/Novotel-Ahmedabad-Hotel.png?fit=1200%2C800"

//   ]
// )

];
ngOnInit(): void {
  
}

constructor(){}
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

setFacilityOwner(FacilityOwner:FacilityDetails[]){
  this.FacilityOwner=FacilityOwner;
  this.FacilityOwnerChanged.next(FacilityOwner.slice());
}

getFacilityOwner(){
  console.log("hiii");
  console.log(this.FacilityOwner);
 // if(this.favouriteFacilities.length>0)
  return this.FacilityOwner.slice();
  //else return this.rooms.slice();
}

getLenghtFacilityOwner(){
  return this.FacilityOwner.length;
}
onAddFacilityOwner(FacilityOwner:Room){
  console.log("adding");
  this.FacilityOwner.push(FacilityOwner);
  this.FacilityOwnerChanged.next(this.FacilityOwner.slice());
  console.log("Added");
  //console.log(this.favouriteFacilities);
  //this.getfavouriteFacilities();
}
getFacilityOwnerId(index:number){
  return this.FacilityOwner[index];
}
removeFacilityOwnerItem(index:number){
  this.FacilityOwner.splice(index,1);
  this.FacilityOwnerChanged.next(this.FacilityOwner.slice());
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
onUpdateFacilityOwner(index:number,newFacilityOwner:Room){
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



}
