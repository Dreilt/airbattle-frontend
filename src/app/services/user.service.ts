import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Invitation } from '../models/invitation';
import {Game} from '../models/game';

const ADMIN_URL = 'http://localhost:8080/api/admin';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getAllUsers(): Promise<any> {
    return this.http.get(ADMIN_URL + '/users').toPromise();
  }

  changeRole(userId, roleId): Observable<any> {
    return this.http.post(`${ADMIN_URL + '/users/user'}/${userId}${'=change_role'}`, roleId, httpOptions);
  }

  changeLock(userId, isBlocked): Observable<any> {
    return this.http.post(`${ADMIN_URL + '/users/user'}/${userId}${'=change_lock'}`, isBlocked, httpOptions);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${ADMIN_URL + '/users/user'}/${userId}${'=delete'}`);
  }

  getUsersOnlineInfo(): Promise<any> {
    return this.http.get('http://localhost:8080/api/user/users_online_info').toPromise()
      .then(r => {
        return r;
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  changeUserData(editUserDataForm, currentUserName: string, currentEmail: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/user/edit_user_data', {
      currentUserName,
      newUserName: editUserDataForm.get('userName').value,
      currentEmail,
      newEmail: editUserDataForm.get('email').value,
    }, httpOptions);
  }

  changePassword(changePasswordForm, currentUserName: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/user/change_password', {
      currentUserName,
      newPassword: changePasswordForm.get('password').value,
    }, httpOptions);
  }

  checkIfFriends(gameId: number): Promise<any> {
    return this.http.get(`${'http://localhost:8080/api/user/check_if_friends/game'}/${gameId}`).toPromise()
      .then(r => {
        return r;
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  sendInvitation(userId: number) {
    let invitation: Invitation = new Invitation();
    invitation.setDateCreated(Date.now().toString());
    return this.http.post(`${'http://localhost:8080/api/user'}/${userId}${'=send_invitation'}`, invitation, httpOptions);
  }

  getAllInvitations(): Promise<any> {
    return this.http.get('http://localhost:8080/api/user/get_all_invitations').toPromise();
  }

  acceptInvitation(invitationFrom: number) {
    return this.http.post(`${'http://localhost:8080/api/user/accept_invitation'}`, invitationFrom, httpOptions);
  }
}
