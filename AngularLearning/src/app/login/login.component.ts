import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  login() {
    this.cookieService.set('logged-in', '');
  }




}
