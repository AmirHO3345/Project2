import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import {FooterComponent} from "./Footer/footer.component";
import {AuthenticationComponent} from "./Windows_PopUp/Authentication/authentication.component";
import {ReservationComponent} from "./Windows_PopUp/Reservation/reservation.component";
import {PopUpComponent} from "./Windows_PopUp/PopUp/pop-up.component";
import {AuthenticationService} from "./Windows_PopUp/Authentication/authentication.service";
import {ContentComponent} from "./Home/content/content.component";
import {HomeComponent} from "./Home/View_Home/home.component";
import {SearchPartComponent} from "./Home/Search/search-part.component";
import { NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSliderModule} from '@angular/material/slider';
import { Ng5SliderModule } from 'ng5-slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SearchComponent } from './Ahmad/search/search.component';
import { RoomItemComponent } from './Ahmad/room-list/room-item/room-item.component';
import { RoomListComponent } from './Ahmad/room-list/room-list.component';
import { RoomsComponent } from './Ahmad/rooms.component';
import { SearchbydetailsComponent } from './Ahmad/search/searchbydetails/searchbydetails.component';
import { RoomDetailsComponent } from './Ahmad/room-list/room-item/room-details/room-details.component';
import { CommentItemComponent } from './Ahmad/room-list/room-item/room-details/comment-item/comment-item.component';
import { UserProfileComponent } from './Ahmad/user-profile/user-profile.component';
import { AppRoutingModule } from './Ahmad/app-routing.module';
import { RoomServiceComponent } from './Ahmad/roomservice.component';
import { HeaderComponent } from './Header/Header.component';
import {SideBarComponent} from "./Header/SideBar/SideBar.component";

import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button"
import {MatDatepickerModule} from "@angular/material/datepicker";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {RouteApplicationModule} from "./Route/RouteApplicaton.module";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MaxStringPipe} from "./Data_Sharing/Pipes/MaxString.pipe";
import {UserChatComponent} from "./Message/UserList/userchat.component";
import {ChatComponent} from "./Message/Chat/chat.component";
import {MessageComponent} from "./Message/message.component";


//import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    PopUpComponent,
    AuthenticationComponent,
    ReservationComponent,
    HomeComponent,
    SearchPartComponent,
    ContentComponent,
    FooterComponent,
    SearchComponent,
    RoomItemComponent,
    RoomListComponent,
    RoomsComponent,
    SearchbydetailsComponent,
    RoomDetailsComponent,
    CommentItemComponent,
    UserProfileComponent,
    HeaderComponent,
    SideBarComponent,
    MaxStringPipe,
    UserChatComponent,
    ChatComponent,
    MessageComponent
  ],
  imports: [RouteApplicationModule , AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule, NgbRatingModule, MatSliderModule, NgxSliderModule/**/, Ng5SliderModule,
    SlickCarouselModule,
    MatIconModule, MatButtonModule, MatToolbarModule, BrowserAnimationsModule,
    MatDatepickerModule, MatNativeDateModule, MatInputModule , MatMenuModule
  ],
  providers: [AuthenticationService,RoomServiceComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
