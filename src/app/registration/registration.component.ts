import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { compareValidator } from '../validators/compare-validator-directive';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage = '';
  isSuccessful = false;
  isSignUpFailed = false;

  isRememberMe = false;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, compareValidator('password')]],
    });
  }

  get userName() {
    return this.registerForm.get('userName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  async onSubmit() {
    const username = this.registerForm.get('userName').value;
    const password = this.registerForm.get('password').value;

    this.authService.register(this.registerForm).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        this.authService.loginAfterRegister(username, password).subscribe(
          data => {
            this.tokenStorage.saveToken(data.accessToken, this.isRememberMe);
            this.tokenStorage.saveUser(data, this.isRememberMe);
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
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  goToMainPage() {
    window.location.href = '/';
  }
}
