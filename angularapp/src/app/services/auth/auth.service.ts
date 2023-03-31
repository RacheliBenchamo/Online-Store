import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserLogin } from '../../models/interfaces/IUserLogin';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private userSubject = new BehaviorSubject<User>(new User());
  //public userObservable: Observable<User>;

  constructor(private http: HttpClient) {
   // this.userObservable = this.userSubject.asObservable();
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
}
