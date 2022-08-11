import { Images } from "../ImagesOfroom.model";

export class FacilityDetailsOwner {
    air_condition !: number;name !: string ;location !: string ;description !: string ;
    photos !: Images[];cost !: number ;type !: string;num_guest !: number;
    num_room !: number ;
      
      wifi !: number;coffee_machine !: number;fridge !: number ;
tv !: number ;
      constructor(air_condition:number,name:string,location:string,description:string,
        photos:Images[],cost:number,type:string,num_guest:number,num_room:number, wifi:number,
        coffee_machine:number,fridge:number,tv:number
       ){

            this.air_condition=air_condition;
            this.coffee_machine=coffee_machine;
            this.cost=cost;
           // this.created_at=created_at;
            this.description=description;
            this.fridge=fridge;
           // this.id=id;
           // this.id_user=id_user;
            this.location=location;
            this.name=name;
            this.num_guest=num_guest;
            this.num_room=num_room;
            this.photos=photos;
           // this.rate=rate;
            this.tv=tv;
            this.type=type;
            this.wifi=wifi;

      }
  }

  