import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdminService} from "../Admin.service";
import {CustomerInfo, CustomerStatisticModel} from "../../Data_Sharing/Model/CustomerStatistic.model";
import {FormControl, NgForm} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {FacilityInfo, FacilityStatisticModel} from "../../Data_Sharing/Model/FacilitiesStatistic.model";
import {forkJoin, Observable} from "rxjs";
import {AuthErrorData} from "../../Windows_PopUp/Authentication/authentication.service";

interface ColumnTableCustomer {
  ID : number ;
  CustomerName : string ;
  CustomerEmail : string ;
  Phone : string ;
  Gender : string ;
  Age : string ;
  Delete ?: any ;
}

interface ColumnTableFacility {
  ID : number ;
  Name : string ;
  Type : string ;
  ID_Owner : number ,
  Location : string ;
  Cost : number ;
  Delete ?: any ;
}

@Component({
  selector: 'control-panel',
  templateUrl: './ControlAdmin.component.html',
  styleUrls: ['../../Data_Sharing/BootStraps/bootstrap.css' , '../Css/Admin.css' ,
    '../Css/Icons/all.css']
})
export class ControlAdminComponent implements AfterViewInit{

  @ViewChild('PaginatorUser') PaginatorUser !: MatPaginator ;
  @ViewChild('PaginatorOwner') PaginatorOwner !: MatPaginator ;
  @ViewChild('PaginatorFacility') PaginatorFacility !: MatPaginator ;
  TableMatData : {
    TableUser : MatTableDataSource<ColumnTableCustomer> ,
    TableOwner : MatTableDataSource<ColumnTableCustomer> ,
    TableFacility : MatTableDataSource<ColumnTableFacility>
  } ;
  InputSearch : {
    User : string ,
    Owner : string ,
    Facility : string
  } ;
  PageInfo : {
    PageInfoUser : {
      CurrentPage : number ,
      TotalPage : number ,
      IsSearchData : boolean
    } ,
    PageInfoOwner : {
      CurrentPage : number ,
      TotalPage : number ,
      IsSearchData : boolean
    } ,
    PageInfoFacility : {
      CurrentPage : number ,
      TotalPage : number ,
      IsSearchData : boolean
    }
  } ;
  Pattern_List : string[] ;
  IsServerAvailable : boolean ;
  MessageError : string ;

  constructor(private AdminServer : AdminService) {
    this.IsServerAvailable = false ;
    this.MessageError = "" ;
    this.Pattern_List = [
      '^([a-zA-Z0-9@*# ]{8,15})$' , /* Password */
      '(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$' , /* UserName */
    ] ;
    let DummyCustomerData : ColumnTableCustomer = {
      ID : 1 ,
      CustomerName : 'string' ,
      CustomerEmail : 'string' ,
      Phone : '1' ,
      Gender : 'string' ,
      Age : '1' ,
    } ;
    let DummyFacilityData : ColumnTableFacility = {
      ID : 1 ,
      Name : "Dummy" ,
      Type : "Dummy" ,
      ID_Owner : 1 ,
      Location : "Dummy" ,
      Cost : 0 ,
    } ;
    this.InputSearch = {
      User : '' ,
      Owner : '' ,
      Facility : ''
    }
    this.TableMatData = {
      TableUser : new MatTableDataSource<ColumnTableCustomer>([DummyCustomerData]) ,
      TableOwner : new MatTableDataSource<ColumnTableCustomer>([DummyCustomerData]) ,
      TableFacility : new MatTableDataSource<ColumnTableFacility>([DummyFacilityData])
    } ;
    this.PageInfo = {
      PageInfoUser : {
        CurrentPage : 1 ,
        TotalPage : 1 ,
        IsSearchData : false
      } ,
      PageInfoOwner : {
        CurrentPage : 1 ,
        TotalPage : 1 ,
        IsSearchData : false
      } ,
      PageInfoFacility : {
        CurrentPage : 1 ,
        TotalPage : 1 ,
        IsSearchData : false
      }
    } ;
  }

  ngAfterViewInit(): void {
    //this.IsServerAvailable = Value.IsAvailable ;
      let Temp = setInterval(() => {
        if(this.PaginatorFacility != undefined && this.PaginatorOwner != undefined &&
          this.PaginatorUser != undefined) {
          clearInterval(Temp);
          forkJoin([this.AdminServer.FetchCustomerList(0 , 1) ,
            this.AdminServer.FetchCustomerList(1 , 1) , this.AdminServer.FetchFacilityList(1)])
            .subscribe(ResultValue => {
              {
                this.PageInfo.PageInfoUser = ResultValue[0].PageInfo ;
                this.PaginatorUser.length =this.PageInfo.PageInfoUser.TotalPage * 10 ;
                this.TableMatData.TableUser.data = this.Customer2Table(ResultValue[0].Result) ;

                this.PageInfo.PageInfoOwner = ResultValue[1].PageInfo ;
                this.PaginatorOwner.length =this.PageInfo.PageInfoOwner.TotalPage * 10 ;
                this.TableMatData.TableOwner.data = this.Customer2Table(ResultValue[1].Result) ;

                this.PageInfo.PageInfoFacility = ResultValue[2].PageInfo ;
                this.PaginatorFacility.length =this.PageInfo.PageInfoFacility.TotalPage * 10 ;
                this.TableMatData.TableFacility.data = this.Facility2Table(ResultValue[2].Result) ;
              }

              this.PaginatorUser.page.subscribe(Value => {
                if(this.PageInfo.PageInfoUser.IsSearchData)
                  this.AdminServer.SearchCustomer(this.InputSearch.User , 0 , Value.pageIndex + 1)
                    .subscribe(Value => {
                      this.PageInfo.PageInfoUser = Value.PageInfo ;
                      this.PaginatorUser.length = this.PageInfo.PageInfoUser.TotalPage * 10 ;
                      this.TableMatData.TableUser.data = this.Customer2Table(Value.Result) ;
                    }) ;
                else
                  this.AdminServer.FetchCustomerList(0 , Value.pageIndex + 1 )
                    .subscribe(Value => {
                      this.PageInfo.PageInfoUser = Value.PageInfo ;
                      this.PaginatorUser.length = this.PageInfo.PageInfoUser.TotalPage * 10 ;
                      this.TableMatData.TableUser.data = this.Customer2Table(Value.Result) ;
                    }) ;
              });

              this.PaginatorOwner.page.subscribe(Value => {
                if(this.PageInfo.PageInfoOwner.IsSearchData)
                  this.AdminServer.SearchCustomer(this.InputSearch.User , 1 , Value.pageIndex + 1)
                    .subscribe(Value => {
                      this.PageInfo.PageInfoOwner = Value.PageInfo ;
                      this.PaginatorOwner.length = this.PageInfo.PageInfoOwner.TotalPage * 10 ;
                      this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result) ;
                    }) ;
                else
                  this.AdminServer.FetchCustomerList(1 , Value.pageIndex + 1 )
                    .subscribe(Value => {
                      this.PageInfo.PageInfoOwner = Value.PageInfo ;
                      this.PaginatorOwner.length = this.PageInfo.PageInfoOwner.TotalPage * 10 ;
                      this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result) ;
                    }) ;
              });

              this.PaginatorFacility.page.subscribe(Value => {
                if(this.PageInfo.PageInfoFacility.IsSearchData)
                  this.AdminServer.SearchFacility(this.InputSearch.Facility , Value.pageIndex + 1)
                    .subscribe(Value => {
                      this.PageInfo.PageInfoFacility = Value.PageInfo ;
                      this.PaginatorFacility.length = this.PageInfo.PageInfoFacility.TotalPage * 10 ;
                      this.TableMatData.TableFacility.data = this.Facility2Table(Value.Result) ;
                    });
                else
                  this.AdminServer.FetchFacilityList(Value.pageIndex + 1)
                    .subscribe(Value => {
                      this.PageInfo.PageInfoFacility = Value.PageInfo ;
                      this.PaginatorFacility.length = this.PageInfo.PageInfoFacility.TotalPage * 10 ;
                      this.TableMatData.TableFacility.data = this.Facility2Table(Value.Result) ;
                    });
              });
            });
        }
      } , 1000);
      return ;
  }

  private Customer2Table(Items : CustomerInfo[]) : ColumnTableCustomer[]  {
    let ResultData : ColumnTableCustomer[] = [] ;
    Items.forEach(Value => ResultData.push({
      ID : Value.ID ,
      CustomerName : Value.CustomerName ,
      CustomerEmail : Value.CustomerEmail ,
      Phone : (Value.SomeData && Value.SomeData.Phone) ? Value.SomeData.Phone.toString() : '__' ,
      Gender : (Value.SomeData && Value.SomeData.Gender) ? Value.SomeData.Gender : '__' ,
      Age : (Value.SomeData && Value.SomeData.Age) ? Value.SomeData.Age.toString() : '__'  ,
    }));
    return ResultData ;
  }

  private Facility2Table(Items : FacilityInfo[]) {
    let ResultData : ColumnTableFacility[] = [] ;
    Items.forEach(Value => ResultData.push({
      ID : Value.ID ,
      Name : Value.Name ,
      Type : Value.Type ,
      ID_Owner : Value.ID_Owner ,
      Location : Value.Location ,
      Cost : Value.Cost
    }));
    return ResultData ;
  }

  public DeleteRow(ID : number , TypeRequest : number , Type ?: number) {
    /*
        if there is Anthor process is done then it's is waiting
        1 : Facility
        2 : Customer
     */
    if(TypeRequest == 1) {
      this.AdminServer.DeleteFacility(ID).subscribe(Value => {
        if(!Value)
          return ;
        if(this.PageInfo.PageInfoUser.IsSearchData)
          this.AdminServer.SearchFacility(this.InputSearch.Facility , this.PageInfo.PageInfoFacility.CurrentPage)
            .subscribe(Value => {
              this.PageInfo.PageInfoFacility = Value.PageInfo ;
              this.PaginatorFacility.length = this.PageInfo.PageInfoFacility.TotalPage * 10 ;
              this.TableMatData.TableFacility.data = this.Facility2Table(Value.Result) ;
            });
        else
          this.AdminServer.FetchFacilityList(this.PageInfo.PageInfoFacility.CurrentPage)
            .subscribe(Value => {
            this.PageInfo.PageInfoFacility = Value.PageInfo ;
            this.PaginatorFacility.length = this.PageInfo.PageInfoFacility.TotalPage * 10 ;
            this.TableMatData.TableFacility.data = this.Facility2Table(Value.Result) ;
          });
      });
    } else {
      this.AdminServer.DeleteCustomer(ID).subscribe(Value => {
        if(!Value)
          return ;
        if(Type == 0) {
          if(this.PageInfo.PageInfoUser.IsSearchData) {
            this.AdminServer.SearchCustomer(this.InputSearch.User , 0 , this.PageInfo.PageInfoUser.CurrentPage)
              .subscribe(Value => {
                this.PageInfo.PageInfoUser = Value.PageInfo ;
                this.PaginatorUser.length = this.PageInfo.PageInfoUser.TotalPage * 10 ;
                this.TableMatData.TableUser.data = this.Customer2Table(Value.Result) ;
              });
          } else {
            this.AdminServer.FetchCustomerList(0 , this.PageInfo.PageInfoUser.CurrentPage)
              .subscribe(Value => {
                this.PageInfo.PageInfoUser = Value.PageInfo ;
                this.PaginatorUser.length = this.PageInfo.PageInfoUser.TotalPage * 10 ;
                this.TableMatData.TableUser.data = this.Customer2Table(Value.Result) ;
              });
          }
        } else {
          if(this.PageInfo.PageInfoOwner.IsSearchData) {
            this.AdminServer.SearchCustomer(this.InputSearch.Owner , 1 , this.PageInfo.PageInfoOwner.CurrentPage)
              .subscribe(Value => {
                this.PageInfo.PageInfoOwner = Value.PageInfo ;
                this.PaginatorOwner.length = this.PageInfo.PageInfoOwner.TotalPage * 10 ;
                this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result) ;
              });
          } else {
            this.AdminServer.FetchCustomerList(1 , this.PageInfo.PageInfoOwner.CurrentPage)
              .subscribe(Value => {
                this.PageInfo.PageInfoOwner = Value.PageInfo ;
                this.PaginatorOwner.length = this.PageInfo.PageInfoOwner.TotalPage * 10 ;
                this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result) ;
              });
          }
        }
      });
    }
  }

  public SearchCustomer(Type : number , Name : string) {
    if(Type == 0) {
      if(Name.length != 0)
          this.AdminServer.SearchCustomer(Name , 0 , 1).subscribe(Value => {
          this.PageInfo.PageInfoUser = Value.PageInfo ;
          this.PaginatorUser.pageIndex = 0 ;
          this.PaginatorUser.length = Value.PageInfo.TotalPage * 10 ;
          this.TableMatData.TableUser.data = this.Customer2Table(Value.Result) ;
        });
      else
          this.AdminServer.FetchCustomerList(0 , 1).subscribe(Value => {
          this.PageInfo.PageInfoUser = Value.PageInfo ;
          this.PaginatorUser.length = this.PageInfo.PageInfoUser.TotalPage * 10 ;
          this.PaginatorUser.pageIndex = 0 ;
          this.TableMatData.TableUser.data = this.Customer2Table(Value.Result) ;
        });
    } else {
      if(Name.length != 0)
        this.AdminServer.SearchCustomer(Name , 1 , 1).subscribe(Value => {
          this.PageInfo.PageInfoOwner = Value.PageInfo ;
          this.PaginatorOwner.pageIndex = 0 ;
          this.PaginatorOwner.length = Value.PageInfo.TotalPage * 10 ;
          this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result) ;
        });
      else
        this.AdminServer.FetchCustomerList(1 , 1).subscribe(Value => {
          this.PageInfo.PageInfoOwner = Value.PageInfo ;
          this.PaginatorOwner.length = this.PageInfo.PageInfoOwner.TotalPage * 10 ;
          this.PaginatorOwner.pageIndex = 0 ;
          this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result) ;
        });
    }
  }

  public SearchFacility(Name : string) {
    if(Name.length != 0)
      this.AdminServer.SearchFacility(Name , 1)
        .subscribe(Value => {
          this.PageInfo.PageInfoFacility = Value.PageInfo ;
          this.PaginatorFacility.length = this.PageInfo.PageInfoFacility.TotalPage * 10 ;
          this.TableMatData.TableFacility.data = this.Facility2Table(Value.Result) ;
        });
    else
      this.AdminServer.FetchFacilityList(1)
        .subscribe(Value => {
          this.PageInfo.PageInfoFacility = Value.PageInfo ;
          this.PaginatorFacility.length = this.PageInfo.PageInfoFacility.TotalPage * 10 ;
          this.TableMatData.TableFacility.data = this.Facility2Table(Value.Result) ;
        });
  }

  public AddCustomer(DataForm : NgForm) {
    if (DataForm.valid) {
      this.MessageError = "" ;
      let Name = (<FormControl>DataForm.form.get("CustomerName")).value;
      let Email = (<FormControl>DataForm.form.get("Add_Email")).value;
      let Pass = (<FormControl>DataForm.form.get("Add_Password")).value;
      let Type = (<FormControl>DataForm.form.get("Add_Type")).value;
      switch (Type) {
        case "User" :
          Type = 0;
          break;
        case "Owner" :
          Type = 1;
          break;
        case "Admin" :
          Type = 2;
          break;
      }
      this.AdminServer.AddCustomer(Name, Email, Pass, Type).subscribe(() => {
        DataForm.resetForm();
        if (Type == 0) {
          if (!this.PageInfo.PageInfoUser.IsSearchData) {
            this.AdminServer.FetchCustomerList(0, this.PageInfo.PageInfoUser.CurrentPage)
              .subscribe(Value => {
                this.PageInfo.PageInfoUser = Value.PageInfo;
                this.PaginatorUser.length = this.PageInfo.PageInfoUser.TotalPage * 10;
                this.TableMatData.TableUser.data = this.Customer2Table(Value.Result);
              });
          }
        } else if (Type == 1) {
          if (!this.PageInfo.PageInfoOwner.IsSearchData) {
            this.AdminServer.FetchCustomerList(1, this.PageInfo.PageInfoOwner.CurrentPage)
              .subscribe(Value => {
                this.PageInfo.PageInfoOwner = Value.PageInfo;
                this.PaginatorOwner.length = this.PageInfo.PageInfoOwner.TotalPage * 10;
                this.TableMatData.TableOwner.data = this.Customer2Table(Value.Result);
              });
          }
        }
      } , (ErrorValue : HttpErrorResponse) => {
        let ErrorData : AuthErrorData = ErrorValue.error ;
        let Error_Type !: keyof typeof ErrorData.Error ;
        for (const ErrorKey in ErrorData.Error)
          if(ErrorData.Error[<keyof typeof ErrorData.Error> ErrorKey] != undefined) {
            Error_Type = <keyof typeof ErrorData.Error> ErrorKey ;
            this.MessageError = (<string[]>ErrorData.Error[Error_Type])[0] ;
            break;
          }
      });
    }
  }
}
