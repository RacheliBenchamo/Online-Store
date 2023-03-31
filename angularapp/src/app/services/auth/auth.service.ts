import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserLogin } from '../../models/interfaces/IUserLogin';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User>(new User());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.userObservable = this.userSubject.asObservable();
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(
      '/Auth/register',
      user
    );
  }

  public login(user: IUserLogin): Observable<string> {
    return this.http.post<string>('/Auth/login', user);
  }

  public editUserDetails(user: User): Observable<User> {
    return this.http.put<User>('/Auth/user', user);
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
