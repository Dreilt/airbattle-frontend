import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';

const CHAT_URL = 'http://localhost:8080/api/chat';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'})
};

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private httpClient: HttpClient
  ) { }

  createMessage(message: Message) {
    return this.httpClient.post(CHAT_URL + '/create_message', message, httpOptions).toPromise()
      .then(

      ).catch(error => {
        return Promise.reject(error);
      });
  }

  getLast50Messages(): Promise<any> {
    return this.httpClient.get(CHAT_URL + '/get_last_50_messages', httpOptions).toPromise()
      .then(messageList => {
        return messageList;
      }).catch(error => {
        return Promise.reject(error);
      });
  }
}
