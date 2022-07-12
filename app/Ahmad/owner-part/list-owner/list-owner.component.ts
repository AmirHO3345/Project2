import { AfterViewChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-owner',
  templateUrl: './list-owner.component.html',
  styleUrls: ['./list-owner.component.css','../../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  '../../room-list/room-item/room-details/room-details.component.css'
  ,'../../../Fonts/css/animate.min.css','../../../Fonts/css/menu.css',
  '../../../Fonts/css/style.css','../../../Fonts/css/responsive.css',
  '../../../Fonts/css/fontello/css/icon_set_1.css','../../../Fonts/css/icon_set_2.css',
  '../../../Fonts/css/fontello/css/fontello.css','../../../Fonts/css/magnific-popup.css',
  '../../../Fonts/css/owl.theme.default.css','../../../Fonts/css/owl.carousel.css',
  '../../../Fonts/css/Date_Time_Picker.css']
})
export class ListOwnerComponent implements OnInit  {
  checkdet=false;
  constructor() { }
  
  
  ngOnInit(): void {
  }
  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  // When the user scrolls down 20px from the top of the document, show the button
scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn")!.style.display = "block";
    } else {
        document.getElementById("myBtn")!.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 

}
