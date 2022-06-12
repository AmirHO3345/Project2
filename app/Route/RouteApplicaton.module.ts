import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../Home/View_Home/home.component";
import {MessageComponent} from "../Message/message.component";

const RouteApplication : Routes = [
  {path : "" , redirectTo : "home" , pathMatch : "full"} ,
  {path : "home" , component : HomeComponent} ,
  {path : "chat" , component : MessageComponent}
  // {path : "**" , redirectTo : "SomethingWrong"}
]

@NgModule({
  imports:[RouterModule.forRoot(RouteApplication)],
  exports:[RouterModule]
})
export class RouteApplicationModule {}
