import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap, finalize, map } from 'rxjs/operators';

import { AuthenticationService } from "../services/authentication.service";
import { environment } from "../../environments/environment";
import { User } from "../models/user";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthenticationService, private readonly http: HttpClient) { }

  private token = "";
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token && currentUser.refreshToken) {
          this.token = currentUser.token;
          this.refreshTokenSubject.next(currentUser.refreshToken);
          if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;

            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            let refreshToken = this.refreshTokenSubject.getValue();
            this.refreshTokenSubject.next(null);

            return this.refreshAccessToken(refreshToken).pipe(
              switchMap((success: boolean) => {
                this.refreshTokenSubject.next(success);
                return next.handle(this.addAuthenticationToken(request));
              }),
              // When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              finalize(() => this.refreshTokenInProgress = false)
            );
          }
        }
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }

  private refreshAccessToken(refreshToken: string): Observable<any> {
    let options = {
      params: {
        'refreshToken': refreshToken
      }};
    return this.http.post<any>(`${environment.apiUrl}/tokens/refresh/`, {}, options)
      .pipe(map((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.token = user.token;
        this.refreshTokenSubject.next(user.refreshToken);
        return user;
      }));
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
