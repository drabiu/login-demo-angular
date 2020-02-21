import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from "../models/user";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let body = {
      'username': username,
      'password': password
    }

    let options = { headers: headers };

    return this.http.post<any>(`${environment.apiUrl}/users/authenticate/`, body, options)
    .pipe(map(user => {
       //store user details and basic auth credentials in local storage to keep user logged in between page refreshes
       localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  googleSignIn(token: string) {
    let options = {
      params: {
        'token': token
      }
    };

    return this.http.post<any>(`${environment.apiUrl}/users/googleSignIn/`, {}, options)
      .pipe(map(user => {
        //store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  facebookSignIn(token: string) {
    let options = {
      params: {
        'token': token
      }
    };

    return this.http.post<any>(`${environment.apiUrl}/users/facebookSignIn/`, {}, options)
      .pipe(map(user => {
        //store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  revoke() {
    let options = {
      params: {
        'refreshToken': this.currentUserSubject.getValue().refreshToken
      }
    };
    return this.http.post<any>(`${environment.apiUrl}/tokens/revoke`, {}, options).subscribe();
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
