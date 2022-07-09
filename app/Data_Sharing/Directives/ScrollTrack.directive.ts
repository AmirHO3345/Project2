import {Directive, ElementRef, OnDestroy, Renderer2} from "@angular/core";
import {BehaviorSubject} from "rxjs";

interface ScrollData {
  HeightScroll : number ;
  TopScroll : number ;
  BottomScroll : number ;
}

@Directive({
  selector : '[scrollTrack]' ,
  exportAs : 'ScrollTracking'
})
export class ScrollTrackDirective implements OnDestroy{

  readonly Scroller_Info : BehaviorSubject<ScrollData> ;

  private ScrollListener : () => void ;

  constructor(private ElementLink : ElementRef , private Render : Renderer2) {
    let InitialData : ScrollData = {
      HeightScroll : this.ElementLink.nativeElement.scrollHeight ,
      TopScroll : this.ElementLink.nativeElement.scrollTop ,
      BottomScroll : this.ElementLink.nativeElement.scrollTop +
        this.ElementLink.nativeElement.offsetHeight
    }
    this.Scroller_Info = new BehaviorSubject<ScrollData>(InitialData);
    this.ScrollListener = this.Render.listen(this.ElementLink.nativeElement , 'scroll' ,
      (e) => this.ListenEvent(e));
  }

  private ListenEvent(event : any) {
    let DataSend : ScrollData = {
      HeightScroll : event.target['scrollHeight'] ,
      TopScroll : event.target['scrollTop'] ,
      BottomScroll : event.target['scrollTop'] + event.target['offsetHeight']
    }
    this.Scroller_Info.next(DataSend);
  }

  AccessStart() : boolean {
    let Start_Pos = this.ElementLink.nativeElement.offsetHeight ;
    let Pos = this.ElementLink.nativeElement.scrollTop + this.ElementLink.nativeElement.offsetHeight ;
    let Max = this.ElementLink.nativeElement.scrollHeight ;
    return (Pos / Max == Start_Pos/Max) ;
  }

  ScrollTo() : void {
    this.ScrollListener();
    /* Stetment*/
    this.ScrollListener = this.Render.listen(this.ElementLink.nativeElement , 'scroll' ,
      (e) => this.ListenEvent(e));
  }

  AccessEnd() : boolean {
    let Pos = this.ElementLink.nativeElement.scrollTop + this.ElementLink.nativeElement.offsetHeight ;
    let Max = this.ElementLink.nativeElement.scrollHeight ;
    return (Pos / Max >= 1) ;
  }

  PercentValue() : number{
    let Pos = this.ElementLink.nativeElement.scrollTop + this.ElementLink.nativeElement.offsetHeight ;
    let Max = this.ElementLink.nativeElement.scrollHeight ;
    return Pos / Max ;
  }

  ngOnDestroy(): void {
    this.ScrollListener();
    this.Scroller_Info.complete()
  }
}
