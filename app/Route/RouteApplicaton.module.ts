import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../Home/View_Home/home.component";
import {MessageComponent} from "../Message/message.component";
import {ChatComponent} from "../Message/Chat/chat.component";

const RouteApplication : Routes = [
  {path : "" , redirectTo : "home" , pathMatch : "full"} ,
  {path : "home" , component : HomeComponent} ,
  {path : "chat" , component : MessageComponent , children : [
      {path : ":id" , component : ChatComponent}
    ]} ,
  // {path : "**" , redirectTo : "SomethingWrong"}
]

@NgModule({
  imports:[RouterModule.forRoot(RouteApplication)],
  exports:[RouterModule]
})
export class RouteApplicationModule {}
