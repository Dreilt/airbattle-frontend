import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(loginForm): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      userName: loginForm.get('userName').value,
      password: loginForm.get('password').value,
    }, httpOptions);
  }

  changeUserStatus() {
    return this.http.post<any>('http://localhost:8080/api/auth/logout', httpOptions);
  }

  register(registerForm): Observable<any> {
    return this.http.post(AUTH_API + 'create_account', {
      userName: registerForm.get('userName').value,
      email: registerForm.get('email').value,
      password: registerForm.get('password').value,
    }, httpOptions);
  }

  loginAfterRegister(userName: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      userName,
      password,
    }, httpOptions);
  }
}
