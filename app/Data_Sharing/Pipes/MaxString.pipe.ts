import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name : "MaxString"
})
export class MaxStringPipe implements PipeTransform {
  transform(Input: string, MaxLength : number): string {
    let OutPut : string = Input.slice(0 , MaxLength) ;
    if(Input.length != OutPut.length)
      OutPut = OutPut.concat("...") ;
    return OutPut;
  }
}
