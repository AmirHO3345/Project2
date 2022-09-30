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
import {SearchComponent} from "../Ahmad/search/search.component";
import {RoomStartComponent} from "../Ahmad/room-details/room-start/room-start.component";
import {RoomDetailsComponent} from "../Ahmad/room-list/room-item/room-details/room-details.component";
import {ListfavsComponent} from "../Ahmad/favourite-list/listfavs/listfavs.component";
import {RoomDetailsComponent2} from "../Ahmad/favourite-list/favourite-page/room-details/room-details.component";
import {ListOwnerComponent} from "../Ahmad/owner-part/list-owner/list-owner.component";
import {RoomDetailsComponent3} from "../Ahmad/owner-part/faciliy-list/faciliy-item/room-details/room-details.component";
import {UserProfileComponent} from "../Ahmad/user-profile/user-profile.component";
import {UserDetailsComponent} from "../Ahmad/user-profile/userdetails/userdatails.component";
import {RoomDetailsComponentAmir} from "../Ahmad/room-list/room-item/room-details copy/room-detailsamir.component";

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






  { path:'search',component:SearchComponent,children:[
      { path:'',component:RoomStartComponent },
      { path:':id',component:RoomDetailsComponent }
    ]},{ path:'favorite',component:ListfavsComponent,children:[
      { path:'',component:RoomStartComponent },
      { path:':id',component:RoomDetailsComponent }]
    , data : { User : true , Owner : false , Admin : false} , canActivate : [AuthenticationGuard]},
  { path:'facilitylist',component:ListOwnerComponent,children:[
      { path:'',component:RoomStartComponent },
      { path:':id',component:RoomDetailsComponent3 }
    ] , data : {
      User : false , Owner : true , Admin : false
    } , canActivate : [AuthenticationGuard]},{
    path:'profile', redirectTo : "home"
  },{
    path:'profile/:id',component:UserDetailsComponent
  },
  {
    path:'roomdetails',component:SearchComponent
  }, {
    path:'roomdetails/:id',component:RoomDetailsComponent
  },












  {path : "**" , redirectTo : "SomethingWrong"}
]

@NgModule({
  imports:[RouterModule.forRoot(RouteApplication)],
  exports:[RouterModule]
})
export class RouteApplicationModule {}
