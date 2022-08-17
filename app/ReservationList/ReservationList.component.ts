import {Component, Inject, OnInit} from "@angular/core";
import {ReservationListService} from "./ReservationList.service";
import {ReservationModel} from "../Data_Sharing/Model/Reservation.model";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";

@Component({
  selector : 'app-reservation' ,
  templateUrl : "./ReservationList.component.html" ,
  styleUrls : ['../Data_Sharing/BootStraps/bootstrap400.css' , './ReservationList.component.css']
})
export class ReservationListComponent implements OnInit{

  ReservationItem : ReservationModel[] ;
  PaginationList : boolean[] ;
  PaginationCoefficient : number ;
  TotalPagination : number ;
  PageSelected !: number ;
  DisableButton : boolean ;
  PopUpControl !: Subject<any>;

  constructor(public ReservationService : ReservationListService , private route : Router
      , private dialog: MatDialog) {
    this.ReservationItem = [] ;
    this.PaginationList = [] ;
    this.PaginationCoefficient = 0 ;
    this.TotalPagination = 0 ;
    this.DisableButton = false ;
  }

  ngOnInit(): void {
    if(this.ReservationService.IsCallBackEnd()) {
      let InfoService = this.ReservationService.GetPageInfo();
      if(InfoService.TotalPage < this.ReservationService.PagesOfPart)
        this.PaginationList = Array(InfoService.TotalPage).fill(false) ;
      else
        this.PaginationList = Array(this.ReservationService.PagesOfPart).fill(false) ;
      this.OnPaginationNumber(InfoService.CurrentPage , false);
    } else
      this.OnPaginationNumber(1 , true );
  }

  OnPaginationNumber(Page : number , IsInitial : boolean) {
    //Page Begin from 1
    this.DisableButton = true ;
    this.PageSelected = Page ;
    this.ReservationService.GetReservationsInfo(Page).subscribe((Value) => {
      this.ReservationItem = Value ;
      let NewValue = this.ReservationService.GetPageInfo();
      this.TotalPagination = NewValue.TotalPage ;
      let NewCoefficient : number ;
      if((Page/this.ReservationService.PagesOfPart) % 1 == 0)
        NewCoefficient = (Page/this.ReservationService.PagesOfPart) - 1 ;
      else
        NewCoefficient = Math.floor(Page/this.ReservationService.PagesOfPart);
      if(NewCoefficient == this.PaginationCoefficient) {
        if(IsInitial) {
          if(NewValue.TotalPage < this.ReservationService.PagesOfPart)
            this.PaginationList = Array(NewValue.TotalPage).fill(false);
          else
            this.PaginationList = Array(this.ReservationService.PagesOfPart).fill(false);
        } else
            this.PaginationList = this.PaginationList.fill(false);
      } else {
        let PageStartNewCoefficient = (NewCoefficient * this.ReservationService.PagesOfPart) + 1 ;
        if(NewValue.TotalPage - PageStartNewCoefficient + 1 < this.ReservationService.PagesOfPart)
          this.PaginationList = Array(NewValue.TotalPage - PageStartNewCoefficient + 1).fill(false);
        else
          this.PaginationList = Array(this.ReservationService.PagesOfPart).fill(false) ;
      }
      this.PaginationCoefficient = NewCoefficient ;
      let ModCalc = Page % this.ReservationService.PagesOfPart ;
      if(ModCalc != 0)
        this.PaginationList[ModCalc - 1] = true ;
      else
        this.PaginationList[this.ReservationService.PagesOfPart - 1] = true ;
      this.DisableButton = false ;
    } , () => {
      let Temp = setInterval(() => {
        clearInterval(Temp);
        if(Page == this.PageSelected)
          this.OnPaginationNumber(Page , IsInitial);
      } , 1000);
    });
  }

  OnPaginationList(State : boolean) {
    this.DisableButton = true ;
    let Temp = this.PaginationCoefficient ;
    if (State)
      Temp++ ;
    else
      Temp-- ;
    this.OnPaginationNumber((Temp * this.ReservationService.PagesOfPart) + 1 , false) ;
  }

  OnDetails(Item : ReservationModel) {
    this.route.navigate(['/roomdetails' , Item.IdReservation]);
  }

  OpenDialog(Item : ReservationModel) {
    const dialogRef = this.dialog.open(PopUpConfirm, {
      width: `${window.screen.width/3}px`,
      data: Item.RoomName,
    });
    this.PopUpControl = dialogRef.componentInstance.Controller ;
    let Temp = this.PopUpControl.subscribe((Value) => {
      if(Value.IsComplete) {
        Temp.unsubscribe();
        return;
      } else if(Value.Sender != dialogRef.id)
        return ;
      this.CancelItem(Item);
    });
    dialogRef.beforeClosed().subscribe(() =>
      this.PopUpControl.next({
        Sender : "" , //any thing
        Available : false , //any thing
        IsComplete : true
      })
    );
    dialogRef.afterClosed().subscribe(() => this.OnPaginationNumber(this.PageSelected , false));
  }

  private CancelItem(Item : ReservationModel) {
    this.ReservationService.SendCancelReservation(Item)
      .subscribe((Value) => {
        if(Value) {
          if(this.PopUpControl != undefined)
            this.PopUpControl.next({
              Sender : this ,
              Available : true ,
            });
          this.ngOnInit();
        } else {
          if(this.PopUpControl != undefined)
            this.PopUpControl.next({
              Sender : this ,
              Available : false ,
            });
        }
      });
  }
}

@Component({
  templateUrl: 'CancelConfirm.component.html',
})
export class PopUpConfirm implements OnInit{

  Controller : Subject<{
    Sender : string ,
    Available : boolean ,
    IsComplete ?: boolean
  }> ;
  DisableButtons : boolean ;
  ErrorView : boolean ;

  constructor(private dialogRef: MatDialogRef<PopUpConfirm>
              ,@Inject(MAT_DIALOG_DATA) public DataPopUp: string) {
    this.Controller = new Subject();
    this.DisableButtons = false ;
    this.ErrorView = false ;
  }

  ngOnInit(): void {
    let Temp = this.Controller.subscribe((Value) => {
          if(Value.IsComplete) {
            Temp.unsubscribe();
            return;
          } else if (Value.Sender == this.dialogRef.id)
            return ;
          if(Value.Available)
            setTimeout(() => this.dialogRef.close() , 2000);
          else {
            this.ErrorView = true ;
            this.DisableButtons = false ;
          }
      }
    );
  }

  onClick(Value : boolean): void {
    if(Value) {
      this.ErrorView = false ;
      this.DisableButtons = true ;
      let Temp = {
        Sender : this.dialogRef.id ,
        Available : true ,
      } ;
      this.Controller.next(Temp);
    } else
      this.dialogRef.close();
  }
}
