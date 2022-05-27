import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {PopUp_Child, PopUpService} from "./Pop-up.service";
import {Subscription, take} from "rxjs";

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements AfterViewInit {

  @ContentChild(PopUpService) Content_PupUp !: PopUp_Child ;
  @ViewChild('OverLay') OverLay !: ElementRef ;
  @ViewChild('Modal') Modal !: ElementRef ;
  @ViewChild('Close') Close !: ElementRef ;
  @Output('PopUp_Close') Close_Sender : EventEmitter<any> ;

  constructor(private Render : Renderer2) {
    this.Close_Sender = new EventEmitter<any>();
  }

  ngAfterViewInit(): void {
    this.Content_PupUp.Send_Close().pipe(take(1))
      .subscribe(() => this.Close_PopUp())
  }

  Close_PopUp() {
    this.Render.removeClass(this.OverLay.nativeElement , 'open');
    this.Render.removeClass(this.Modal.nativeElement , 'open');
    this.Render.removeClass(this.Close.nativeElement , 'show');
    setTimeout(() => this.Close_Sender.emit(' '),1000);
  }
}
