import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { compareValidator } from '../validators/compare-validator-directive';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  currentUser: any;
  private currentUserName;
  private currentEmail;

  editUserDataForm: FormGroup;
  changePasswordForm: FormGroup;

  successUserDataMessage = '';
  isSuccessfulUserData = false;
  errorUserDataMessage = '';
  isErrorUserData = false;

  successChangePasswordMessage = '';
  isSuccessfulPassword = false;
  errorChangePasswordMessage = '';
  isErrorPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private token: TokenStorageService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserName = this.currentUser.userName;
    this.currentEmail = this.currentUser.email;

    this.editUserDataForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });

    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, compareValidator('password')]],
    });
  }

  get userName() {
    return this.editUserDataForm.get('userName');
  }

  get email() {
    return this.editUserDataForm.get('email');
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  async onSubmitChangeUserData() {
    this.userService.changeUserData(this.editUserDataForm, this.currentUserName, this.currentEmail).subscribe(
      data => {
        console.log(data);
        this.successUserDataMessage = data.message;
        this.isSuccessfulUserData = true;
        this.isErrorUserData = false;
      },
      err => {
        this.errorUserDataMessage = err.error.message;
        this.isErrorUserData = true;
        this.isSuccessfulUserData = false;
      }
    );
  }

  async onSubmitChangePassword() {
    this.userService.changePassword(this.changePasswordForm, this.currentUserName).subscribe(
      data => {
        console.log(data);
        this.successChangePasswordMessage = data.message;
        this.isSuccessfulPassword = true;
        this.isErrorPassword = false;
      },
      err => {
        this.errorChangePasswordMessage = err.error.message;
        this.isErrorPassword = true;
        this.isSuccessfulPassword = false;
      }
    );
  }
}
