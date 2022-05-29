import { Component, Injectable, OnInit,EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Comment } from '../room-list/room-item/room-details/comment.model';
import { Room } from './room.model';
import { User } from './user.model';
@Injectable()
export class RoomServiceComponent  {

  currentDate = new Date();
    roomChanged=new Subject<Room[]>();
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
   private rooms:Room[]=[
        new Room('Four Seasons','soo gorgues',
        'https://offloadmedia.feverup.com/secretneworleans.co/wp-content/uploads/2021/03/10101834/Webp.net-resizeimage-46-1024x597.jpg'
        ,4,210,'dsfsdf',4,4,'dsfsdf',
        [
          new Comment("the hotel soo bad",3,"Ahmad Ghm",this.currentDate,"c:\photo1.jpg"),
         // new Comment("the hotel soo good",3,"mhmd amr",this.currentDate)
        ],
        
          this.images=[
            "https://img1.10bestmedia.com/Images/Photos/137390/downtown-hotels-overview_55_660x440_201404221801.jpg"
          ]
        
       
         )
   ,new Room('Ramsis hotel','sea of desert',
   'https://moneyinc.com/wp-content/uploads/2016/09/Four-Seasons-Las-Vegas-750x422.jpg'
  ,5,125
  ,'damas',3,5,'shalet',
  [
    new Comment(" soo bad",2,"ansa",this.currentDate,"c:\photo1.jpg"),
    new Comment("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a lorem quis neque interdum consequat ut sed sem. Duis quis tempor nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus",5,"fad amr",this.currentDate,"c:\photo1.jpg"),
    new Comment("the hotel soo good",3,"mhmd amr",this.currentDate,"c:\photo1.jpg")
  ],
  
    this.images=[
      "https://media.cntraveler.com/photos/5da87c95040bc900083f500e/master/w_4000,h_2703,c_limit/Hotel-Theodore_2019_HotelTheodore-2.jpg",
      "https://digital.ihg.com/is/image/ihg/staybridge-suites-seattle-4079661105-4x3",
      "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_470,q_65,w_640/v1/clients/wilmingtonnc/ff2c5ff3_70de_445b_a001_29b51aa8dec6_81ccd151-7cb3-4f33-a9b6-431bbaef4009.jpg"
    ]
        
  ),new Room('Pour Qoui hotel','big tower awasome',
   'https://cdn.businesstraveller.com/wp-content/uploads/fly-images/1024133/TT-Four-Season-916x516.jpg'
  ,2,75,'dsfsdf',4,4,'dsfsdf',
  [
    new Comment("wow",3,"amer",this.currentDate,"c:\photo1.jpg"),
    new Comment("baaad",1,"moner",this.currentDate,"c:\photo1.jpg")
  ],
  this.images=[
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/22443294.jpg?k=fc9d8a13beb15e92eb0479d21af7e66ae55f8da78f5b45b1b63a2937a52fb3d0&o=&hp=1",
    "https://www.insidehook.com/wp-content/uploads/2021/09/Novotel-Ahmedabad-Hotel.png?fit=1200%2C800"

  ]
)

];

//constructor(private shoppinglistservice:ShoppingService){}
getUsers(){
  return this.users.slice();
}
getRooms(){
    return this.rooms.slice();
}getImages(){
  return this.images;
}
getRoomId(index:number){
    return this.rooms[index];
  }
  roomRate:Room[]=[];

  getRoomsByRating(rate:number){

    let j=0;
    for(let i=0; i<this.rooms.length;i++){

      if(this.rooms[i].rating===rate){
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
 
  
  
  
  /*
  addIngredientsToShoppngList(ingred:ingredient[])
  {
        this.shoppinglistservice.addIngredients(ingred);
  }*/
  onAddRecipe(room:Room){
      this.rooms.push(room);
      this.roomChanged.next(this.rooms.slice());
  }
  onUpdateRoom(index:number,newRoom:Room){
        this.rooms[index]=newRoom;
        this.roomChanged.next(this.rooms.slice());

  }
  onDeleteRecipe(index:number){
      this.rooms.splice(index,1);
      this.roomChanged.next(this.rooms.slice());
  }

  setRecipes(roomss:Room[]){
    this.rooms=roomss;
    this.roomChanged.next(roomss.slice());
  }



}
