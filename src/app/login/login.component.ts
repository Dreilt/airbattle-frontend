import { TokenStorageService } from '../services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      isRememberMe: [],
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get isRememberMe() {
    return this.loginForm.get('isRememberMe');
  }

  async onSubmit() {
    const isRememberMe = this.loginForm.get('isRememberMe').value;

    this.authService.login(this.loginForm).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken, isRememberMe);
        this.tokenStorage.saveUser(data, isRememberMe);
        this.roles = this.tokenStorage.getUser().roles;
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.goToMainPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  goToMainPage() {
    window.location.href = '/';
  }
}
