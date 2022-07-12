export class Comment{

    public strComment!:string;
    public ratingComment!:number;
    public nameofUser!:string;
    public dateofWritten!:Date;
    public photo!:string;
    constructor(strComment:string,ratingComment:number,nameofUser:string,dateofWritten:Date,photo:string){
        
        this.strComment=strComment;
        this.ratingComment=ratingComment;
        this.nameofUser=nameofUser;
        this.dateofWritten=dateofWritten;
        this.photo=photo;
    }
    
}

