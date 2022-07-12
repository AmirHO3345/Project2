import { Images } from "./ImagesOfroom.model";
import { Comment } from "./room-list/room-item/room-details/comment.model";
import { RoomDetailsComponent } from "./room-list/room-item/room-details/room-details.component";

export class Room{
  air_condition !: number;
	coffee_machine !: number;
	cost !: number ;
	created_at! : string ;
	description !: string ;
	fridge !: number ;
	id !: number ;
	id_user !: number ;
	location !: string ;
	name !: string ;
	num_guest !: number;
	num_room !: number ;
	photos !: Images[];
//	rate !: number ;
	tv !: number ;
	type !: string;
	wifi !: number;
    constructor(air_condition : number,
      coffee_machine : number,
      cost : number ,
      created_at : string ,
      description : string ,
      fridge : number ,
      id : number ,
      id_user : number ,
      location : string ,
      name : string ,
      num_guest : number,
      num_room : number ,
      photos : Images[],
    //rate : number ,
      tv : number ,
      type : string,
      wifi : number)
    {
        this.air_condition=air_condition;
        this.coffee_machine=coffee_machine;
        this.cost=cost;
      this.created_at=  created_at;
      this.description=description;
      this.fridge=fridge;
      this.id=id;
      this.id_user=id_user;
      this.location=location;
      this.name=name;
      this.num_guest=num_guest;
      this.num_room=num_room;
      this.photos=photos;
    //  this.rate=rate;
      this.tv=tv;
      this.type=type;
      this.wifi=wifi;
    }
}




