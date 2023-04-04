import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { IUserLogin } from '../../models/interfaces/IUserLogin';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // BehaviorSubject to store the current user
  private userSubject = new BehaviorSubject<User>(new User());
  public userObservable: Observable<User>;

  // Class variable to store the login error message
  private loginErrorMessage: string = '';

  // Class variable to store the current user
  private currUser!: User;

  constructor(private http: HttpClient) {
    this.userObservable = this.userSubject.asObservable();
  }

  /**
   * Registers a new user and returns the registered user
   * @param user
   * @returns Observable<User>
   */
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

  /**
   * Logs in a user and returns the token and user object
   * @param userLogin
   * @returns Observable<{ token: string, user: User }>
   */
  public login(userLogin: IUserLogin): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>('/users/login', userLogin).pipe(
      map((response: { token: string, user: User }) => {
        // Set the current user
        this.setUser(response.user);
        return response; // Return the response as is
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error and save it in a class variable
        this.loginErrorMessage = error.error;
        return throwError(error); // Rethrow the error to propagate it further
      })
    );
  }

  /**
   * Gets the current user from the server (not in use for now)
   * @returns Observable<User>
   */
  public getUser2(): Observable<User> {
    return this.http.get<User>('/users').pipe(
      map((user: User) => {
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * Edits the details of a user (not in use for now)
   * @param user
   * @returns Observable<User>
   */
  public editUserDetails(user: User): Observable<User> {
    return this.http.put<User>('/users/user', user);
  }

  /**
   * @returns the login error message
   */
  public get loginErrMsg(): string {
    return this.loginErrorMessage;
  }

  /**
   * Sets the authentication token to local storage
   * @param token
   */
  public setTokenToLocal(token: string) {
    localStorage.setItem('auth_token', token);
  }

  /**
   * @returns if a user is currently connected
   */
  public IsUserConnect(): boolean {
    let authToken = localStorage.getItem('auth_token');
    // Check if the authToken is null or undefined
    if (!authToken) {
      return false;
    }
    return true;
  }

  /**
   * 
   * @returns the current user
   */
  public getUser(): User {
    return this.currUser;
  }

  /**
   * Sets the current user
   * @param user
   */
  public setUser(user: User): void {
    this.currUser = user;
  }

  /**
   * Logs out the current user
   */
  public logout() {
    localStorage.removeItem('auth_token');
    this.setUser(new User()); // Set the current user to a new User object
    this.userSubject.next(this.currUser);
    window.location.reload(); // Reload
  }
}
