import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class PopUpService {}

export interface PopUp_Child {
  Send_Close() : Subject<any>;
}
