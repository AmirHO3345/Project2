import {Directive, ElementRef, OnDestroy, Renderer2} from "@angular/core";
import {BehaviorSubject} from "rxjs";

interface ScrollData {
  HeightScroll : number ; // Total Height View + Invisible side
  TopScroll : number ; // Far from above
  BottomScroll : number ; // Offset + Top , whereas the offset height of just view without Invisible side
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

  AccessStart(ShiftPercent : number) : boolean {
    let Max = this.Scroller_Info.value.HeightScroll ;
    let Start_Pos = this.ElementLink.nativeElement.offsetHeight;
    let Pos = this.Scroller_Info.value.BottomScroll - (Max * ShiftPercent) ;
    return (Pos / Max <= Start_Pos/Max) ;
  }

  ScrollTo(FullyShift ?: boolean , Shift ?: number ) : void {
    this.ScrollListener();
    if(FullyShift != undefined) {
      if(FullyShift)
        this.ElementLink.nativeElement.scrollTop = 0 ;
      else
        this.ElementLink.nativeElement.scrollTop
          = this.ElementLink.nativeElement.scrollHeight - this.ElementLink.nativeElement.offsetHeight  ;
    } else if(Shift != undefined) {
      this.ElementLink.nativeElement.scrollTop = this.ElementLink.nativeElement.scrollHeight - Shift ;
    }
    this.ScrollListener = this.Render.listen(this.ElementLink.nativeElement , 'scroll' ,
      (e) => this.ListenEvent(e));
  }

  AccessEnd(ShiftPercent : number) : boolean {
    let Max = this.Scroller_Info.value.HeightScroll ;
    let Pos = this.Scroller_Info.value.BottomScroll + (Max * ShiftPercent) ;
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
