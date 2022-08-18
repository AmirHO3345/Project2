import { Component, OnInit } from '@angular/core';
import {contentService, ServiceAvailable} from "./content.service";
import {Room_InformationModel , Room_Specification} from "../../Data_Sharing/Model/Room_Information.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: [ '../../Data_Sharing/BootStraps/bootstrap_Elbert.css' , './css/style.css' , './css/responsive.css'
   , '../../Fonts/css/icon_set_2.css' , '../../Fonts/css/icon_set_1.css' ]
})
export class ContentComponent implements OnInit {

  TopRateRoom : Room_InformationModel[] ;
  TopSellRoom : Room_InformationModel[] ;

  constructor(private ContentServer : contentService , private route : Router) {
    this.TopRateRoom = [] ;
    this.TopSellRoom = [] ;
  }

  ngOnInit(): void {
    this.ContentServer.UpdateService.subscribe(Value => {
      if(Value == ServiceAvailable.ReadyGetData) {
        let DataService = this.ContentServer.GetData();
        this.TopRateRoom = DataService.RateRoom ;
        this.TopSellRoom = DataService.SellRoom ;
      }
    });
  }

  OnDetails(NotificationItem : Room_InformationModel) {
    this.route.navigate(['/roomdetails' , NotificationItem.Facility_ID]);
  }
}
