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
    BlockBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
