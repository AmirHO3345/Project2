import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
  name : "DateConvert"
})
export class DateConvertPipe implements PipeTransform {

  constructor(private FormatDate : DatePipe) {
  }

  transform(Input: string | Date , State : number , RelativeTo ?: Date): string {
    let InputDate = new Date(Input) ;
    switch (State) {
        case 1 :
        if(RelativeTo == undefined)
          return "" ;
        {
          let Temp = new Date(+RelativeTo + (1000*60*60*24)) ;
          if(+InputDate >= +RelativeTo && +InputDate < +Temp)
            return <string>this.FormatDate.transform(InputDate , "h:mm a");
        }
        {
          let Temp = new Date(+RelativeTo - (1000*60*60*24*7)) ;
          if(+InputDate > +Temp)
            return <string>this.FormatDate.transform(InputDate , "EEE h:mm a");
        }
        {
          let Temp = new Date(+RelativeTo - (1000*60*60*24*365)) ;
          if(+InputDate > +Temp)
            return <string>this.FormatDate.transform(InputDate , "LLL d h:mm a");
          else
            return <string>this.FormatDate.transform(InputDate , "d.M.yy h:mm a");
        }
      case 2 :
        return <string>this.FormatDate.transform(InputDate , "EEEE, MMMM d, y h:mm a");
      default :
        return "" ;
    }
  }
}
