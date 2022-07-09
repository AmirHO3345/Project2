import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
  name : "DateConvert"
})
export class DateConvertPipe implements PipeTransform {

  constructor(private FormatDate : DatePipe) {
  }

  transform(Input: string | Date , RelativeTo : Date): string {
    let InputDate = new Date(Input) ;
    {
      let Temp = new Date(+RelativeTo + (1000*60*60*24)) ;
      if(+InputDate >= +RelativeTo && +InputDate < +Temp)
        return <string>this.FormatDate.transform(InputDate , "h:mm a");
    }
    {
      let Temp = new Date(+RelativeTo - (1000*60*60*24*7)) ;
      if(+InputDate > +Temp)
        return <string>this.FormatDate.transform(InputDate , "EEE");
    }
    {
      let Temp = new Date(+RelativeTo - (1000*60*60*24*365)) ;
      if(+InputDate > +Temp)
        return <string>this.FormatDate.transform(InputDate , "LLL d");
      else
        return <string>this.FormatDate.transform(InputDate , "d.M.yy");
    }
  }
}
