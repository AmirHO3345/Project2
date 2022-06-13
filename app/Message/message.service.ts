import {Injectable} from "@angular/core";
import Pusher, {Channel} from "pusher-js";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {ConsigneeDataModel} from "../Data_Sharing/Model/ConsigneeData.model";
import {MessageModel} from "../Data_Sharing/Model/Message.model";
import {AuthenticationService} from "../Windows_PopUp/Authentication/authentication.service";

interface UserListResponse {
  Chats : {
    id : number ,
    profile_rec : {
      name : string ,
      status : number ,
      path_photo : string
    },
    lastMessage : {
      id_message : number ,
      message : string ,
      created_at : string
    },
    countNotread : number
  }[];
  current_page: number ;
  url_next_page: string | null ;
  url_first_page: string ;
  url_last_page : string ;
  total_items: number ;
}

/*
When Open Any User From List Users it send to route chat or Somehow
Instance of ConsigneeDataModel it represents this User you need to Send to him
 */
interface MessageListResponse {
  messages : {
    id : number ,
    id_send : number ,
    id_recipient : number ,
    message : string ,
    read_at : string | null , //Check
    created_at : Date ,
  }[];
  current_page : number;
  url_next_page: string | null ;
  url_first_page: string ;
  url_last_page: string ;
  total_items: number ;
}

interface SendResponse {
  Success : string ;
}

@Injectable()
export class MessageService {

  PusherProcess : Pusher ;
  ClientsGetter : Channel[] ; // Channels for all Users
  UserListPage : number ;
  MessagePage : number ;

  constructor(private HTTP : HttpClient) {
    this.PusherProcess = new Pusher("98034be202413ea485fc" , {cluster : "ap2"}) ;
    this.ClientsGetter = [] ;
    this.UserListPage = this.MessagePage = 1 ;
  }

  private AddClientChannel(Client_ID : number) {
    let ClientChannel = this.PusherProcess.channel(`Room.Chat.${Client_ID}`);
    this.ClientsGetter.push(ClientChannel);
  }

  FetchUserList() {
    let Params = new HttpParams();
    Params.append("page" , this.UserListPage++);
    return this.HTTP.get<UserListResponse>(`${AuthenticationService.API_Location}api/chat/display_chats` ,
      {params : Params}).
      pipe(map((Data : UserListResponse) => {
        let Data_Response : ConsigneeDataModel[] = [] ;
        Data.Chats.map(UserData => {
          let User = new ConsigneeDataModel(UserData.id ,
            AuthenticationService.API_Location.concat(UserData.profile_rec.path_photo) ,
            UserData.profile_rec.name , !!(UserData.profile_rec.status) ,
            UserData.countNotread , UserData.lastMessage.message ,
            new Date(UserData.lastMessage.created_at));
          this.AddClientChannel(User.UserID);
          Data_Response.push(User);
        });
        return Data_Response;
    }))
  }

  FetchMessageList(ID_A : number , ID_B : number) {
    let Params = new HttpParams();
    Params.append("page" , this.MessagePage++);
    return this.HTTP.get<MessageListResponse>(`${AuthenticationService.API_Location}api/chat/show`).
      pipe(map((Data : MessageListResponse) => {
      let Data_Response : MessageModel[] = [] ;
      Data.messages.map(UserData => {
        let Message = new MessageModel(UserData.id , UserData.id_send , UserData.id_recipient ,
          UserData.message , new Date(UserData.created_at));
        Data_Response.push(Message);
      });
      return Data_Response ;
    }));
  }

  SendMessage(ID_From : number , ID_To : number , Message_Content : string ) {
    return this.HTTP.post<SendResponse>(`${AuthenticationService.API_Location}api/chat/send` , {
      // From : ID_From ,
      id_recipient : ID_To ,
      message : Message_Content ,
    }).pipe(map((Data : SendResponse) => {
      return new MessageModel(55, ID_From, ID_To, Message_Content,
        new Date()) ;
    }));
  }
}
