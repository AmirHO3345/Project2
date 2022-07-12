import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStoragrService, FacilityDetails } from '../DataStorageService';
import { RoomServiceComponent } from '../roomservice.component';
import { ListfavsComponent } from './listfavs/listfavs.component';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['../room-list/room-item/room-details/room-details.component.css'
  ,'../../Data_Sharing/Bootstraps/bootstrap.css',
  //,'../../../styles.css'
  '../search/search.component.css','../../Fonts/css/animate.min.css','../../Fonts/css/menu.css',
  '../../Fonts/css/style.css','../../Fonts/css/responsive.css',
  '../../Fonts/css/fontello/css/icon_set_1.css','../../Fonts/css/icon_set_2.css',
  '../../Fonts/css/fontello/css/fontello.css','../../Fonts/css/magnific-popup.css',
  '../../Fonts/css/owl.theme.default.css','../../Fonts/css/owl.carousel.css',
  '../../Fonts/css/Date_Time_Picker.css']
})
export class FavouriteListComponent implements OnInit {
  @Output() favouriteWasSelected=new EventEmitter<FacilityDetails>();
  subscription!:Subscription;
  favourites!:FacilityDetails[];

  
  constructor(private datastorage:DataStoragrService, private roomService:RoomServiceComponent,private lisyfav:ListfavsComponent/*,private router:Router,private route:ActivatedRoute*/){}
  checkk=this.lisyfav.check;

  ngOnInit(){
    this.datastorage.getFavouriteList();
    this.subscription= this.roomService.favouriteFacilitiesChanged.subscribe(
        (favourite:FacilityDetails[])=>{
            this.favourites=favourite;
        }
  );
    this.favourites=this.roomService.getfavouriteFacilities();
  }
  /*
  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo:this.route});
  }*/
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
  onfavouriteSelected(favourite:FacilityDetails){
    this.favouriteWasSelected.emit(favourite);
  }
  getfavNum(){
    return this.roomService.getLenghtfavouriteFacilities();
  }
  

}
