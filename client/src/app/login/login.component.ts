import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginInvalid = false;
  invalidEmail = false;
  public flag = false;
  public inputEmail = false;
  public userType;
  public myGroup;

  constructor(private cookieService: CookieService) {
    this.myGroup = new FormGroup({
      firstName: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.cookieService.set('logged-in', '');
  }
  register() {}
  select(userType: string) {
    this.userType = userType;
    this.inputEmail = true;
    this.flag = true;
    console.log('test');
  }
  toggleFlag() {
    this.flag = true;
  }





}
