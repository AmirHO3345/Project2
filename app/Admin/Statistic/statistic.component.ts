import { Component, OnInit } from '@angular/core';
import {StatisticService} from "./statistic.service";

@Component({
  selector: 'statistic-panel',
  templateUrl: './statistic.component.html',
  styleUrls: ['../../Data_Sharing/BootStraps/bootstrap.css' , '../Css/Admin.css' ,
    '../Css/Icons/all.css']
})
export class StatisticComponent implements OnInit {

  constructor(private StatisticServer : StatisticService) { }

  ngOnInit(): void {
  }

}
