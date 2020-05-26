import { User } from './user';

export class Invitation {

  id: number;
  invitationFrom: User;
  invitationTo: User;
  dateCreated: string;

  public setDateCreated(dateCreated: string) {
    this.dateCreated = dateCreated;
  }
}
