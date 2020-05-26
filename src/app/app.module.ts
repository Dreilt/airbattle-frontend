import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material.module';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {authInterceptorProviders} from './helpers/auth.interceptor';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {CompareValidatorDirective} from './validators/compare-validator-directive';
import {AdminpanelUsersComponent} from './adminpanel-users/adminpanel-users.component';
import {NewGameComponent} from './new-game/new-game.component';
import {GameBoardComponent} from './game-board/game-board.component';
import {InvitationsComponent} from './invitations/invitations.component';
import {MainPageComponent} from './main-page/main-page.component';


@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      RegistrationComponent,
      UserProfileComponent,
      CompareValidatorDirective,
      AdminpanelUsersComponent,
      NewGameComponent,
      GameBoardComponent,
      InvitationsComponent,
      MainPageComponent
   ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        FormsModule,
    ],
   providers: [
      authInterceptorProviders
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
