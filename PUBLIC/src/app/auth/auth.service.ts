import { Injectable } from '@angular/core';
import {  HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environmet';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {

  }

  login(username: string, password: string): Observable<any> {
    // return this.http.post('/api/login', {username, email, accountNumber, password, confirmPassword});
    return of(true).pipe(
      tap((response) => {
        localStorage.setItem('userToken','1234567890');
        localStorage.setItem('userName',username);        
        this.router.navigate(['/dashboard']);
      })
    );
  }

  register(data: any): void {
  //   this.http.post(`${environment.apiUrl}/register`, data).pipe(
  //     tap(() => {
        this.router.navigate(['/login']);
  //       alert('Registration successful! Please login.');
  //     }),
  //     catchError(this.handleError)
  //   ).subscribe();
  }

  private decodeJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    alert(errorMessage);
    return throwError(errorMessage);
  }

  getFormConfig(): Observable<any> {
    return of({
      "login": ["user", "password"],
      "register": ["name", "email", "accountName", "password", "confirmPassword"]
  });//this.http.get('./config.json');
  }

  loadFormConfig() {
    return of({});//this.http.get('/assets/config.json');
  }
  isLoggedIn(): boolean {
    if(localStorage.getItem('userToken') !== null){
      return true;
    }
    return false;
  }

}