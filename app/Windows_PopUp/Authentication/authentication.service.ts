import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {UserModel} from "../../Data_Sharing/Model/user.model";

interface AuthResponseData {
  user : {
      name: string ,
      email : string ,
      amount : number,
      rule : string ,
      id : number ,
    },
  token : string ,
  path_photo : string
}

export interface AuthErrorData {
  Error : {
    "email" ?: string[] ,
    "password" ?: string[] ,
    "password_c" ?: string[] ,
    "rule" ?: string[]
  }
}

@Injectable()
export class AuthenticationService {

  Account : BehaviorSubject<UserModel | null> ;

  PopUpRegisterOpen : Subject<any>;

  static API_Location : string = "http://localhost/Laravel-Project-Api-Facility-Reservation/public/" ;

  constructor(private HTTP : HttpClient) {
    this.Account = new BehaviorSubject<UserModel | null>(null);
    this.PopUpRegisterOpen = new Subject();
  }

  SignUp(Email : string , Password : string , UserName : string , Client_Type : boolean) : Observable<AuthResponseData> {
    return this.HTTP.post<AuthResponseData>(`${AuthenticationService.API_Location}api/auth/register` ,  {
      name : UserName ,
      email : Email ,
      password : Password ,
      password_c : Password ,
      rule : (Client_Type)? "0" : "1" ,
    })
      .pipe(tap(Data_Response => {
          console.log(Data_Response);
          this.AuthenticationInit(Data_Response);
      })
    );
  }

  Login(Email : string , Password : string , KeepAccount : boolean ) : Observable<AuthResponseData> {
    return this.HTTP.post<AuthResponseData>(`${AuthenticationService.API_Location}api/auth/login` , {
      email : Email ,
      password : Password
    })
      .pipe(tap(Data_Response => this.AuthenticationInit(Data_Response , KeepAccount))
    );
  }

  Logout() {
    localStorage.removeItem("UserAccount");
    this.Account.next(null);
  }

  AutoLogin() {
    const Temp : string | null = localStorage.getItem("UserAccount");
    if(Temp == null)
      return;
    let UserData : UserModel = UserModel.Json2Object(Temp);
    this.Account.next(UserData);
  }

  private AuthenticationInit(Information : AuthResponseData , KeepAccount : boolean = false) : void {
    let ImagePath = AuthenticationService.API_Location.concat(Information.path_photo) ;
    const User = new UserModel(Information.user.id , Information.user.name , Information.token ,
      Information.user.rule , ImagePath);
    if(KeepAccount)
      localStorage.setItem("UserAccount" , UserModel.Object2Json(User));
    this.Account.next(User);
  }
}
