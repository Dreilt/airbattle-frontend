import {RegistrationComponent} from './registration/registration.component';
import {LoginComponent} from './login/login.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AdminpanelUsersComponent} from './adminpanel-users/adminpanel-users.component';
import {NewGameComponent} from './new-game/new-game.component';
import {GameBoardComponent} from './game-board/game-board.component';
import {InvitationsComponent} from './invitations/invitations.component';
import {MainPageComponent} from './main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'users', component: AdminpanelUsersComponent },
  { path: 'new_game', component: NewGameComponent },
  { path: 'game/:id', component: GameBoardComponent },
  { path: 'your_invitations', component: InvitationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
