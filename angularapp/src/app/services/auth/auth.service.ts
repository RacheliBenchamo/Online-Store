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
  private currUser!: User;

  constructor(private http: HttpClient,
    private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>('/users/register', user).pipe(
      map((response: User) => {
        return response; // Return the response as a User object
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error); // Rethrow the error to propagate it further
      })
    );
  }

  public login(userLogin: IUserLogin): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>('/users/login', userLogin).pipe(
      map((response: { token: string, user: User }) => {
        return response; // Return the response as is
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error and save it in a class variable
        this.loginErrorMessage = error.error;
        return throwError(error); // Rethrow the error to propagate it further
      })
    );
  }

  //public getUser(): Observable<User> {
  //  return this.http.get<User>('/users').pipe(
  //    map((user: User) => {
  //      return user; 
  //    }),
  //    catchError((error: HttpErrorResponse) => {
  //      return throwError(error); 
  //    })
  //  );
  //}

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

  public getUser(): User {
    return this.currUser;
  }

  public setUser(user: User): void {
    this.currUser = user;
  }

  public logout() {
    localStorage.removeItem('auth_token');
  }
}
