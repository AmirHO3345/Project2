import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {map, Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Client} from "../../Data_Sharing/Model/user.model";

// Route must be exist Enum Client as Data

@Injectable()
export class AuthenticationGuard implements CanActivate{

  constructor(private AuthInfo : AuthenticationService ,private Router : Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.AuthInfo.Account.pipe(map((UserInfo) => {
      if(UserInfo == null)
        return this.Router.createUrlTree(['404']); // This URL is Temp
      let Client_Type : Client = route.data['Client_Type'] ;
      if(UserInfo.GetType() == Client_Type)
        return true;
      switch (UserInfo.GetType()) {
        case Client.User :
          return this.Router.createUrlTree(['404']); // This URL is Temp
        case Client.Owner :
          return this.Router.createUrlTree(['404']); // This URL is Temp
        default :
          return this.Router.createUrlTree(['404']); // This URL is Temp
      }
    }));
  }

}
