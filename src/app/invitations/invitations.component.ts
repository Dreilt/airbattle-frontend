import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {Game} from '../models/game';
import {Invitation} from '../models/invitation';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {

  invitationList: Invitation[];
  displayedColumns: string[] = ['invitationFrom', 'dateCreated', 'action'];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAllInvitations();
  }

  getAllInvitations() {
    this.userService.getAllInvitations().then(
      r => {
        this.invitationList = r;
      }
    ).catch(error => {
      console.log('Nie pobrano zaproszeń dla użytkownika');
    });
  }

  acceptInvitation(invitationFrom: number) {
    this.userService.acceptInvitation(invitationFrom).subscribe();
    window.location.reload();
  }
}
