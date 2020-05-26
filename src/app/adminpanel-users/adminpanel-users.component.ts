import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-adminpanel-users',
  templateUrl: './adminpanel-users.component.html',
  styleUrls: ['./adminpanel-users.component.scss']
})
export class AdminpanelUsersComponent implements OnInit {

  userList: User[];
  displayedColumns: string[] = ['userName', 'email', 'role', 'blocked', 'action'];

  isChangeRoleSuccess = false;
  isBlockedUnblockedSuccess = false;
  isDeleteSuccess = false;
  successMessage = '';

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().then(
      userList => {
        this.userList = userList;
        console.log(this.userList);
      }
    ).catch(e => {
      alert('Nie pobrano listy użytkowników.');
    });
  }

  changeRole(userId: string, roleId: string) {
    this.userService.changeRole(userId, roleId).subscribe();
    this.successMessage = 'Rola użytkownika została zmieniona.';
    this.isChangeRoleSuccess = true;
  }

  changeLock(userId: string, isBlocked: number) {
    this.userService.changeLock(userId, isBlocked).subscribe();

    if (isBlocked === 0) {
      this.successMessage = 'Użytkownik został odblokowany.';
    } else if (isBlocked === 1) {
      this.successMessage = 'Użytkownik został zablokowany.';
    }

    this.isBlockedUnblockedSuccess = true;
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe();
    this.successMessage = 'Użytkownik został usunięty.';
    this.isDeleteSuccess = true;
    this.getAllUsers();
    this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }
}
