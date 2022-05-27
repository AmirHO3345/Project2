import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Subject } from 'rxjs';
import {PopUp_Child, PopUpService} from "../PopUp/Pop-up.service";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  providers : [{
    provide : PopUpService,
    useExisting : ReservationComponent
  }]
})
export class ReservationComponent implements OnInit, AfterViewInit , PopUp_Child {

  @ViewChild('Flipped') Flip_Card !: ElementRef;
  @ViewChild('Dark_Color_Front') Color_D_F !: ElementRef;
  @ViewChild('Light_Color_Front') Color_L !: ElementRef;
  @ViewChild('Dark_Color_Back') Color_D_B !: ElementRef;
  @ViewChild('Reservation') Reservation !: NgForm;
  //Setter And Getter
  Name_Client: string;
  Card_Number: string;
  Expiration_Date: string;
  Security_Code: string;
  Icon_Num: number;
  Reservation_Done : Subject<any> | null ;


  constructor(public Render: Renderer2) {
    this.Name_Client = "";
    this.Card_Number = "";
    this.Expiration_Date = "";
    this.Security_Code = "";
    this.Icon_Num = 1;
    this.Reservation_Done = null ;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let Temp_Color = this.Check_Color(this.Icon_Num);
    this.Render.addClass(this.Color_L.nativeElement , Temp_Color);
    this.Render.addClass(this.Color_D_F.nativeElement , `${Temp_Color}dark`);
    this.Render.addClass(this.Color_D_B.nativeElement , `${Temp_Color}dark`);
  }

  Focus_Security() {
    this.Render.addClass(this.Flip_Card.nativeElement , 'flipped');
  }

  UnFocus_Security() {
    this.Render.removeClass(this.Flip_Card.nativeElement , 'flipped');
  }

  private Check_Color(Icon : number) : string {
    switch (Icon) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'lime';
      case 4:
        return 'purple';
      case 5:
        return 'red'
      case 6:
        return 'orange';
      case 7:
        return "grey"
      default :
        return 'cyan'
    }
  }

  Change_Icon() {
    let Temp_Color = this.Check_Color(this.Icon_Num);
    this.Render.removeClass(this.Color_L.nativeElement , Temp_Color);
    this.Render.removeClass(this.Color_D_F.nativeElement , `${Temp_Color}dark`);
    this.Render.removeClass(this.Color_D_B.nativeElement , `${Temp_Color}dark`);
    this.Icon_Num = (this.Icon_Num == 8)? 1 : this.Icon_Num + 1 ;
    Temp_Color = this.Check_Color(this.Icon_Num);
    this.Render.addClass(this.Color_L.nativeElement , Temp_Color);
    this.Render.addClass(this.Color_D_F.nativeElement , `${Temp_Color}dark`);
    this.Render.addClass(this.Color_D_B.nativeElement , `${Temp_Color}dark`);
  }

  Send_Close(): Subject<any> {
    this.Reservation_Done = new Subject<any>();
    // setTimeout(() => this.Reservation_Done?.next(' '), 2000);
    return this.Reservation_Done;
  }

  OnSubmit() {
      // When Done Send from Reservation_Done to pup up to close
  }
}
