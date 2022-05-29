import { Comment } from "../room-list/room-item/room-details/comment.model";


export class Room{
    public name:string;
    public description:string;
    public ImagePath:string;
    public rating!:number;
    public price!:number;
    public loc!:string;
    public maxPersons!:number;
    public roomNumber!:number;
    public facilityType!:string;
    public images!:string[];
    public comments!:Comment[];
    constructor(name:string,desc:string,path:string,rating:number,price:number
      ,loc:string,maxPersons:number,roomNumber:number,facilityType:string,comm:Comment[],images:string[])
    {
        this.name=name;
        this.description=desc;
        this.ImagePath=path;
        this.rating=rating;
        this.price=price;
        this.loc=loc;
        this.maxPersons=maxPersons;
        this.roomNumber=roomNumber;
        this.facilityType=facilityType;
        this.comments=comm;
        this.images=images;
    }
}




