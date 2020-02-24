import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from "../services/authentication.service";
//import { AuthService } from 'angularx-social-login';
//import { SocialUser } from 'angularx-social-login';
//import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

declare var FB: any;

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  //auth2: any;

  //@ViewChild('loginRef', { static: true }) loginElement: ElementRef;

  //private user: SocialUser;
  //private loggedIn: boolean;


  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private ngZone: NgZone
    //private authService: AuthService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  //const gapi: any;
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    window['angularComponentReference'] = { component: this, zone: this.ngZone, loadAngularFunction: (token: string) => this.angularFunctionCalled(token), };

    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '635984350523176',
        cookie: true,
        xfbml: true,
        version: 'v6.0'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    //this.googleInit();
    //this.googleSDK();
    //this.prepareLoginButton();


    //this.authService.authState.subscribe((user) => {
    //  this.user = user;
    //  this.loggedIn = (user != null);
    //});

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  //public auth2: any;

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/home']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  angularFunctionCalled(token: string) {
    console.log(token);
    this.authenticationService.googleSignIn(token)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/home']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  submitFBLogin() {
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response) => {
      console.log('submitLogin', response);
      if (response.authResponse) {
        this.authenticationService.facebookSignIn(response.authResponse.accessToken)
          .pipe(first())
          .subscribe(
            data => {
              console.log(data);
              this.router.navigate(['/home']);
            },
            error => {
              this.error = error;
              this.loading = false;
            });
      }
      else {
        console.log('User login failed');
      }
    });

  }

  //public googleInit() {
  //  let that = this;
  //  this.gapi.load('auth2', function () {
  //    that.auth2 = this.gapi.auth2.init({
  //      client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
  //      cookiepolicy: 'single_host_origin',
  //    });
  //    that.onSignIn(that.auth2.nativeElement.firstChild);
  //  });
  //}
  //onSignIn(element) {
  //  console.log('element is now ', element);

  //  this.auth2.attachClickHandler(element,
  //    {},
  //    function(googleUser) {

  //      var profile = googleUser.getBasicProfile();
  //      const desc = {
  //        'ID: ': profile.getId(),
  //        'Name: ': profile.getName(),
  //        // 'Image URL: ' : profile.getImageUrl(),
  //        'Email: ': profile.getEmail()
  //      }
  //      alert(JSON.stringify(desc));
  //      // console.log('Token || ' + googleUser.getAuthResponse().id_token);
  //      console.log(profile)
  //      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //      console.log('Name: ' + profile.getName());
  //      console.log('Image URL: ' + profile.getImageUrl());
  //      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  //    });
  //};

  //signInWithGoogle(): void {
  //  this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
  //}

  //signInWithFB(): void {
  //  this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  //}

  //onGoogleSignIn(googleUser: any) {
  //  var profile = googleUser.getBasicProfile();
  //  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //  console.log('Name: ' + profile.getName());
  //  console.log('Image URL: ' + profile.getImageUrl());
  //  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  //}

  //prepareLoginButton() {

  //  this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
  //    (googleUser) => {

  //      let profile = googleUser.getBasicProfile();
  //      console.log('Token || ' + googleUser.getAuthResponse().id_token);
  //      console.log('ID: ' + profile.getId());
  //      console.log('Name: ' + profile.getName());
  //      console.log('Image URL: ' + profile.getImageUrl());
  //      console.log('Email: ' + profile.getEmail());
  //      //YOUR CODE HERE


  //    }, (error) => {
  //      alert(JSON.stringify(error, undefined, 2));
  //    });

  //}

  //googleSDK() {
  //  window['googleSDKLoaded'] = () => {
  //    window['gapi'].load('auth2',
  //      function() {
  //        this.auth2 = window['gapi'].auth2.init({
  //          'apiKey': 'AIzaSyAz8dwuRIIaKeNaZRlKQOLl_639bJXwbzQ',
  //          'clientId': '468923844593-uev8e0igl667dri8oqvpb9ilve2crfeh.apps.googleusercontent.com',
  //          'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
  //          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  //        }).then(() => {
  //          window['gapi'].auth2.getAuthInstance();
  //        });
  //        this.prepareLoginButton();
  //      });
  //  };

    //window['googleSDKLoaded'] = () => {
    //  window['gapi'].load('auth2',
    //    () => {
    //      this.auth2 = window['gapi'].auth2.init({
    //        client_id: '468923844593-uev8e0igl667dri8oqvpb9ilve2crfeh.apps.googleusercontent.com',
    //        cookiepolicy: 'single_host_origin',
    //        scope: 'profile email'
    //      });
    //      this.prepareLoginButton();
    //    });
    //};

  //  (function (d, s, id) {
  //    var js, fjs = d.getElementsByTagName(s)[0];
  //    if (d.getElementById(id)) { return; }
  //    js = d.createElement(s); js.id = id;
  //    js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
  //    fjs.parentNode.insertBefore(js, fjs);
  //  }(document, 'script', 'google-jssdk'));

  //}
}
