import { RoomServiceComponent } from "./roomservice.component";

export class User{
    id!:number;
    name!:string;
    email!:string;
    password!:string;
    //private room!:RoomServiceComponent;
    constructor(id:number,name:string,email:string,password:string)
    {
        this.id=id;
        this.name=name;
        this.email=email;
        this.password=password;
    }

}