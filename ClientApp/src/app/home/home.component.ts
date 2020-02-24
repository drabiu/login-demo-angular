import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from "../../environments/environment";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  users = [];
  constructor(
    private readonly authenticationService: AuthenticationService, private http: HttpClient) {
    this.http.get(`${environment.apiUrl}/users/`).subscribe((users: [string]) =>
      this.users = users);
  }

  revoke() {
    this.authenticationService.revoke();
  }
}
