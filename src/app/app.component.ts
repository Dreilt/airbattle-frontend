import { TokenStorageService } from './services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private roles: string[];
  isLoggedIn = false;
  showAdminPanel = false;
  userName: string;
  public usersOnline: string;

  constructor(
    private tokenStorageService: TokenStorageService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminPanel = this.roles.includes('ROLE_ADMIN');

      this.userName = user.userName;
    }

    setInterval(() => {
      this.getUsersOnlineInfo();
    }, 100);
  }

  logout() {
    this.tokenStorageService.logout();
    window.location.reload();
  }

  getUsersOnlineInfo() {
    this.userService.getUsersOnlineInfo().then(
      r => {
        this.usersOnline = r;
      }
    ).catch(e => {
      alert('Nie udało się pobrać informacji o ilości graczy online.');
    });
  }
}
