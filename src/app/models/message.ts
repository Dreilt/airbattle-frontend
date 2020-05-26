import {User} from './user';

export class Message {

  id: number;
  user: User;
  textMessage: string;
  dateCreated: string;

  public setUserName(user: User) {
    this.user = user;
  }

  public setTextMessage(textMessage: string) {
    this.textMessage = textMessage;
  }

  public setDateCreated(dateCreated: string) {
    this.dateCreated = dateCreated;
  }
}
