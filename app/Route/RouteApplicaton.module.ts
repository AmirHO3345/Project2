import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../Home/View_Home/home.component";
import {MessageComponent} from "../Message/message.component";
import {ChatComponent} from "../Message/Chat/chat.component";
import {ReservationListComponent} from "../ReservationList/ReservationList.component";
import {NotificationComponent} from "../Notification/notification.component";
import {StatisticComponent} from "../Admin/Statistic/statistic.component";
import {ControlAdminComponent} from "../Admin/Control Customer/ControlAdmin.component";
import {Route404Component} from "../Route404/route404.component";
import {AuthenticationGuard} from "../Windows_PopUp/Authentication/Authentication.guard";

const RouteApplication : Routes = [
  {path : "" , redirectTo : "home" , pathMatch : "full"} ,
  {path : "home" , component : HomeComponent} ,
  {path : "chat" , component : MessageComponent , children : [
      {path : ":id" , component : ChatComponent}
    ] , data : {
      User : true , Owner : true , Admin : false
    } ,  canActivate : [AuthenticationGuard]} ,
  {path : "notificationList" , component : NotificationComponent , data : {
      User : true , Owner : true , Admin : true
    } ,  canActivate : [AuthenticationGuard]} ,
  {path : "reservationList" , component : ReservationListComponent , data : {
      User : true , Owner : false , Admin : false
    }, canActivate : [AuthenticationGuard]} ,
  {path : "statistic" , component : StatisticComponent , data : {
      User : false , Owner : false , Admin : true
    } , canActivate : [AuthenticationGuard]} ,
  {path : "adminController" , component : ControlAdminComponent , data : {
      User : false , Owner : false , Admin : true
    } , canActivate : [AuthenticationGuard]} ,
  {path : "SomethingWrong" , component : Route404Component} ,
  {path : "**" , redirectTo : "SomethingWrong"}
]

@NgModule({
  imports:[RouterModule.forRoot(RouteApplication)],
  exports:[RouterModule]
})
export class RouteApplicationModule {}
