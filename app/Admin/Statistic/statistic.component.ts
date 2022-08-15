import {Component, OnInit} from '@angular/core';
import {AdminService} from "../Admin.service";
import {forkJoin} from "rxjs";

interface BlockData {
  Name : string ,
  Amount : number ,
  IsMoney : boolean ,
  Percent : {
    Amount : number ,
    IsIncrease : boolean
  }
  LastMonth : number ,
  Logo : number
}

@Component({
  selector: 'statistic-panel',
  templateUrl: './statistic.component.html',
  styleUrls: ['../../Data_Sharing/BootStraps/bootstrap.css' , '../Css/Admin.css' ,
    '../Css/Icons/all.css']
})
export class StatisticComponent implements OnInit  {

  BlocksData : BlockData[] ;
  IsServerAvailable : boolean ;
  LastMonth : number ;

  constructor(private AdminServer : AdminService) {
    this.BlocksData = [] ;
    this.LastMonth = 5 ;
    this.IsServerAvailable = false ;
  }

  ngOnInit(): void {
    forkJoin([this.AdminServer.FetchCountAllCustomer(0) , this.AdminServer.FetchCountAllCustomer(1)
      , this.AdminServer.FetchCountCustomerForget() , this.AdminServer.FetchFacilityData()
      , this.AdminServer.FetchInfoSinceLastMonth(this.LastMonth)]).subscribe(Value => {
      let UserCount = Value[0] ;
      let OwnerCount = Value[1] ;
      let FacilityCount = Value[3] ;
      let ForgetCustomer = Value[2] ;
      let DataSinceMonth = Value[4] ;

      let Temp  = AdminService.CalculateRelativePoints(DataSinceMonth.User);
      this.BlocksData.push({
        Name : "Count User" ,
        Amount : UserCount ,
        IsMoney : false ,
        Percent : {
          Amount : Temp[Temp.length - 1] ,
          IsIncrease : (Temp[Temp.length - 1] >= 0)
        } ,
        LastMonth : this.LastMonth ,
        Logo : 1
      }) ;
      Temp  = AdminService.CalculateRelativePoints(DataSinceMonth.Owner);
      this.BlocksData.push({
        Name : "Count Owner" ,
        Amount : OwnerCount ,
        IsMoney : false ,
        Percent : {
          Amount : Temp[Temp.length - 1] ,
          IsIncrease : (Temp[Temp.length - 1] >= 0)
        } ,
        LastMonth : this.LastMonth ,
        Logo : 1
      }) ;
      this.BlocksData.push({
        Name : "Customers who forget site" ,
        Amount : ForgetCustomer ,
        IsMoney : false ,
        Percent : {
          Amount : -0.5 ,
          IsIncrease : false
        } ,
        LastMonth : this.LastMonth ,
        Logo : 1
      }) ;
      Temp  = AdminService.CalculateRelativePoints(DataSinceMonth.Facility);
      this.BlocksData.push({
        Name : "Count Facilities" ,
        Amount : FacilityCount.CountFacilities ,
        IsMoney : false ,
        Percent : {
          Amount : Temp[Temp.length - 1] ,
          IsIncrease : (Temp[Temp.length - 1] >= 0)
        } ,
        LastMonth : this.LastMonth ,
        Logo : 1
      }) ;
      Temp  = AdminService.CalculateRelativePoints(FacilityCount.DetailsCostBooking.MonthDetails);
      this.BlocksData.push({
        Name : "Count Booking" ,
        Amount : FacilityCount.CountBooking ,
        IsMoney : false ,
        Percent : {
          Amount : Temp[Temp.length - 1] ,
          IsIncrease : (Temp[Temp.length - 1] >= 0)
        } ,
        LastMonth : this.LastMonth ,
        Logo : 1
      }) ;
      Temp  = AdminService.CalculateRelativePoints(FacilityCount.DetailsCountBooking.MonthDetails);
      this.BlocksData.push({
        Name : "Cost Bookings" ,
        Amount : FacilityCount.CostBookings ,
        IsMoney : true ,
        Percent : {
          Amount : Temp[Temp.length - 1] ,
          IsIncrease : (Temp[Temp.length - 1] >= 0)
        } ,
        LastMonth : this.LastMonth ,
        Logo : 1
      }) ;
    });
  }

  public Convert2Icon(IdLogo : number) {
    return "fas fa-users fa-2x text-info" ;
  }
}
