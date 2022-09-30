import { Images } from "../ImagesOfroom.model";

export class FacilityDetailsOwner {
    air_condition !: string;name !: string ;location !: string ;description !: string ;
    photo_list !: FormData[];cost !: number ;type !: string;num_guest !: number;
    num_room !: number ;
      
      wifi !: string;coffee_machine !: string;fridge !: string ;
tv !: string ;
      constructor(air_condition:string,name:string,location:string,description:string,
            cost:number,type:string,num_guest:number,num_room:number, wifi:string,
        coffee_machine:string,fridge:string,tv:string
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
          //  this.photo_list=photo_list;
           // this.rate=rate;
            this.tv=tv;
            this.type=type;
            this.wifi=wifi;

      }
  }

  