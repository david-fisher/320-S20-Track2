import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {DialogContentExampleDialog, UhOhDialog} from "../createaccount/createaccount.component";
import {MatDialog} from "@angular/material/dialog";
import {account} from './account'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup; // FormGroup variable for building the form
  hide = true; // used for displaying or hiding the password
  post: any = ''; // holds the output of the form
  public flag = false; // flag variable for indicating whether the login card should be displayed or the create account sequence

  constructor(private formBuilder: FormBuilder, private cookieService: CookieService, private router: Router, public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    /*
    Creates the form when the page loads
     */
    this.createForm();
  }

  createForm() {
    /*
    Create the form group for logging in
     */
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, Validators.required],
    });
  }

  getErrorEmail() {
    /*
    Returns error string based on the type of issue the email has
     */
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  getErrorPassword() {
    /*
    Returns required error for password
     */
    return this.formGroup.get('password').hasError('required') ? 'Field is required' : '';
  }
  onSubmit(post) {
    /*
    Run upon clicking the Login button, gets the form data and calls sendData()
     */
    this.post = post;
    this.sendData();
  }

  toggleFlag() {
    /*
    Toggles flag, When true start create account sequence, when false display login card.
     */
    this.flag = true;
  }

  sendData() {
    /*
    Sends user email and password to database with POST to /authentication.

    On POST success:
      - Set cookies
      - Navigate to home page (/home)

    On POST fail:
      - Display dialog depending on the HTTP response error
      - Reset form fields
     */
    let email_split = this.post['email'].split('@');
    let email = email_split[0] + '@' + email_split[1].toLowerCase();

    let data = {
      'username': CryptoJS.SHA3(email, { outputLength: 224 }).toString(CryptoJS.enc.Hex),
      'password': CryptoJS.SHA3(this.post['password'], { outputLength: 224 }).toString(CryptoJS.enc.Hex)
    };
    console.log(data);

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/authentication',
      data).subscribe(res => {
      console.log(Object.values(res));
      console.log(res);
      console.log(res['user-id']);
      let user_id = res['user-id'].toString();
      let user_type = res['type'];
      account.user_id = user_id;
      account.user_type = user_type;
      this.cookieService.set('user_id', user_id);
      this.cookieService.set('user_type', user_type);
      this.cookieService.set('logged-in', '');
      this.router.navigate(['/home']);
    }, error => {
        console.log(error);
        console.log(error['error']['message']);
        if (error['error']['message'] === 'Password Does Not Match') {
          this.dialog.open(IncorrectPasswordDialog);
        } else if (error['error']['message'] === 'User DNE') {
          this.dialog.open(IncorrectEmailDialog);
        } else {
          this.dialog.open(UhOhDialog);
        }
        this.formGroup.reset();
    });





  }
}

// incorrect password dialog component
@Component({
  selector: 'incorrect-password-dialog',
  templateUrl: 'incorrect-password-dialog.html',
})
export class IncorrectPasswordDialog {}

// incorrect email dialog component
@Component({
  selector: 'incorrect-email-dialog',
  templateUrl: 'incorrect-email-dialog.html',
})
export class IncorrectEmailDialog {}
