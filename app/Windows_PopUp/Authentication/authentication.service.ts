import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from "rxjs";
import {UserModel} from "../../Data_Sharing/Model/user.model";

interface AuthResponseData {
  IDToken : string ,
  UserName : string ,
  UserID : number ,
  Email : string ,
  ImagePath : string,
  Client_Type : string
}

@Injectable()
export class AuthenticationService {

  Account : BehaviorSubject<UserModel | null> ;
  PopUpRegisterOpen : Subject<boolean>;

  constructor(private HTTP : HttpClient) {
    this.Account = new BehaviorSubject<UserModel | null>(null);
    this.PopUpRegisterOpen = new Subject();
  }

  SignUp(Email : string , Password : string , UserName : string , Client_Type : boolean) : Observable<AuthResponseData> {
    return this.HTTP.post<AuthResponseData>('URL' , {
      name : UserName ,
      email : Email ,
      password : Password ,
      rule : (Client_Type)? 0 : 1
    }).pipe(catchError(this.AuthenticationError()), tap(Data_Response => {
          this.AuthenticationInit(Data_Response);
      })
    );
  }

  Login(Email : string , Password : string , KeepAccount : boolean ) : Observable<AuthResponseData> {
    return this.HTTP.post<AuthResponseData>('URL' , {
      email : Email ,
      password : Password ,
    }).pipe(catchError(this.AuthenticationError()), tap(Data_Response => {
          this.AuthenticationInit(Data_Response , KeepAccount );
      })
    );
  }

  Logout() {
    localStorage.removeItem("UserAccount");
    this.Account.next(null);
  }

  private AuthenticationInit(Information : AuthResponseData , KeepAccount : boolean = false) : void {
    const User = new UserModel(Information.UserName , Information.ImagePath , Information.IDToken);
    if(KeepAccount)
      localStorage.setItem("UserAccount" , JSON.stringify(User));
    this.Account.next(User);
  }

  private AuthenticationError() : any {
    return new Error("dsadas"); //Temp
  }

  AutoLogin() {
    const Temp : string | null = localStorage.getItem("UserAccount");
    if(Temp == null)
      return;
    const User : UserModel = JSON.parse(Temp);
    this.Account.next(User);
  }
}
