import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { IUserLogin } from '../../models/interfaces/IUserLogin';
import { User } from '../../models/User';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User>(new User());
  public userObservable: Observable<User>;
  private loginErrorMessage: string = '';

  constructor(private http: HttpClient,
    private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(
      '/Users/register',
      user
    );
  }
  public login(userLogin: IUserLogin): Observable<string> {
    return this.http.post<string>('/users/login', userLogin).pipe(
      map((response: string) => {
        return response; // Return the response as is
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error and save it in a class variable
        this.loginErrorMessage = error.error;
        return throwError(error); // Rethrow the error to propagate it further
      })
    );
  }

  getUser(): Observable<User> {
    return this.http.get<User>('/users').pipe(
      map((response: User) => {
        return response; // Return the response as a User object
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error); // Rethrow the error to propagate it further
      })
    );
  }

  public get loginErrMsg(): string {

    return this.loginErrorMessage;
  }


  public editUserDetails(user: User): Observable<User> {
    return this.http.put<User>('/users/user', user);
  }

  public setTokenToLocal(token: string) {
    localStorage.setItem('auth_token', token);
  }

  public IsUserConnect(): boolean {
    let authToken = localStorage.getItem('auth_token');

    // Check if the authToken is null or undefined
    if (!authToken) 
        return false;
    return true;
  }

  public logout() {
    localStorage.removeItem('auth_token');
  }
}
