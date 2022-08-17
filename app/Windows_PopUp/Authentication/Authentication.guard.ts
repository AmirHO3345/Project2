import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {map, Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Client} from "../../Data_Sharing/Model/user.model";

// Route must be exist Enum Client as Data

@Injectable({providedIn : 'root'})
export class AuthenticationGuard implements CanActivate{

  constructor(private AuthInfo : AuthenticationService ,private Router : Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.AuthInfo.Account.pipe(map((UserInfo) => {
      if(UserInfo == null)
        return this.Router.createUrlTree(['SomethingWrong']);
      switch (UserInfo.GetType()) {
        case Client.User :
          if(!route.data["User"])
            return this.Router.createUrlTree(['SomethingWrong']);
          break ;
        case Client.Owner :
          if(!route.data["Owner"])
            return this.Router.createUrlTree(['SomethingWrong']);
          break ;
        case Client.Admin :
          if(!route.data["Admin"])
            return this.Router.createUrlTree(['SomethingWrong']);
          break ;
      }
      return true ;
    }));
  }

}
