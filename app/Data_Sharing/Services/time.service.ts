import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn : 'root'
})
export class TimeService {

  UpdateTime : BehaviorSubject<Date> ;
  TimeInterval : number ;

  constructor(private ProcessDate : DatePipe) {
    this.UpdateTime = new BehaviorSubject<Date>(new Date(new Date().setHours(0,0,0,0)));
    this.TimeInterval = TimeService.RemainingDay();
    setInterval(() => {
      this.TimeInterval = TimeService.RemainingDay();
      this.UpdateTime.next(new Date(new Date().setHours(0,0,0,0)));
    } , this.TimeInterval);
  }

  private static RemainingDay() : number {
    let NextDate : number =  (new Date().setHours(0,0,0,0)) + (1000*60*60*24);
    let CurrentDate : number = +new Date() ;
    return NextDate - CurrentDate ;
  }

  GetDateFormat(date : Date , Format : string) : string {
    let Temp = this.ProcessDate.transform(date , Format) ;
    return (Temp != null)? Temp : "" ;
  }

  static SortDate(DataUnSort : {[DateLink : number] : Date}) : {ID : number , ID_Date : Date}[] {
    let ArrayDate : {ID : number , ID_Date : Date}[] = [] ;
    for (const Key of Object.keys(DataUnSort)) {
      let DateLink : number = Number.parseInt(Key) ;
      ArrayDate.push({
        ID : DateLink ,
        ID_Date : DataUnSort[DateLink]
      });
    }
    ArrayDate = ArrayDate.sort((A , B) => {
      let Date_A : Date = A.ID_Date ,
        Date_B : Date = B.ID_Date ;
      if(Date_A < Date_B) return 1 ;
      if(Date_A > Date_B) return -1 ;
      return 0 ;
    });
    return ArrayDate ;
  }

}
