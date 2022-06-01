import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import {FooterComponent} from "./Footer/footer.component";
import {HeaderTestComponent} from "./Header/header-test.component";
import {BlockBoxComponent} from "./Header/BlockBox/BlockBox.component";
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
//import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    PopUpComponent,
    AuthenticationComponent,
    ReservationComponent,
    HeaderTestComponent,
    HomeComponent,
    SearchPartComponent,
    ContentComponent,
    FooterComponent,
    BlockBoxComponent,
    SearchComponent,
    RoomItemComponent,
    RoomListComponent,
    RoomsComponent,
    SearchbydetailsComponent,
    RoomDetailsComponent,
    CommentItemComponent,
    UserProfileComponent
  ],
  imports: [AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule, NgbRatingModule,MatSliderModule,NgxSliderModule/**/,Ng5SliderModule,
    SlickCarouselModule
  ],
  providers: [AuthenticationService,RoomServiceComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
