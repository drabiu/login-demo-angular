import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from "./login/login.component";
import { JwtInterceptor } from "./Interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./Interceptors/error.interceptor";
//import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
//import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

//let config = new AuthServiceConfig([
//  {
//    id: GoogleLoginProvider.PROVIDER_ID,
//    provider: new GoogleLoginProvider("468923844593-uev8e0igl667dri8oqvpb9ilve2crfeh.apps.googleusercontent.com")
//  },
//  {
//    id: FacebookLoginProvider.PROVIDER_ID,
//    provider: new FacebookLoginProvider("Facebook-App-Id")
//  }
//]);

//export function provideConfig() {
//  return config;
//}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    //SocialLoginModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //{
    //  provide: AuthServiceConfig,
    //  useFactory: provideConfig
    //}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
