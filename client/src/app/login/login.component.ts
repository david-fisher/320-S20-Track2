import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  hide = true;
  encryptSecretKey = 'test';
  loginInvalid = false;
  post: any = '';
  public flag = false;

  constructor(private formBuilder: FormBuilder, private cookieService: CookieService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, Validators.required],
    });
  }

  // checkPassword(control) {
  //   let enteredPassword = control.value;
  //   let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  //   return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  // }

  test() {
    console.log('test1');
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'Field is required' : '';
      // this.formGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }
  onSubmit(post) {
    console.log('test');
    this.post = post;
    this.sendData()
  }

  select(userType: string) {
    this.flag = true;
  }
  toggleFlag() {
    this.flag = true;
  }

  sendData() {
    let email_split = this.post['email'].split('@');
    let email = email_split[0] + '@' + email_split[1].toLowerCase();

    let data = {
      'username': CryptoJS.SHA3(email).toString(CryptoJS.enc.Hex),
      'password': CryptoJS.SHA3(this.post['password']).toString(CryptoJS.enc.Hex)
      // 'username': this.post['email'],
      // 'password': this.post['password']
    };
    console.log(data);

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/authentication',
      data).subscribe(res => {
      console.log(Object.values(res));
      if (res['status'] === 200) {
        let user_id = '';
        try {
          user_id = res['user_id'];
        }
        catch(err) {
          user_id = '';
        }
        console.log('test');
        this.cookieService.set('user_id', user_id);
        this.cookieService.set('logged-in', '');
        this.router.navigate(['/home']);
      }
    });
    // this.router.navigate(['/login']);
    this.cookieService.set('user_id', '');
    this.cookieService.set('logged-in', '');
    this.router.navigate(['/home']);



  }





}
