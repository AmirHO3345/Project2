import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from "@angular/core";
import {BlockBoxData} from "../../Data_Sharing/Model/BlockBox.model";

@Component({
  selector : 'app-BlockBox',
  templateUrl : './BlockBox.component.html',
  styleUrls : ['./BlockBox.component.css'] ,
})
export class BlockBoxComponent implements AfterViewInit{

  @Input("AddInfo") ItemInfo !: { Type_Box : string , Info : BlockBoxData[]} ;
  @ViewChild("MainTemplate") Element_Control !: ElementRef

  constructor(private Render : Renderer2) {}

  GetInfo(i : number) : BlockBoxData {
    return this.ItemInfo.Info[i];
  }

  ngAfterViewInit() {
    let Type : string = (this.ItemInfo.Type_Box == "Message")? "Message_Type" : "Notification_Type" ;
    this.Render.addClass(this.Element_Control.nativeElement , "dropdown-menu");
    this.Render.addClass(this.Element_Control.nativeElement , Type);
    this.Render.addClass(this.Element_Control.nativeElement , "animated");
    this.Render.addClass(this.Element_Control.nativeElement , "fadeInDown");
  }

}




