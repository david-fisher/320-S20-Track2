import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../auth/auth.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(private cookieService: CookieService, private auth: AuthService) {}

  isStudent() {
    //console.log(this.cookieService.get('user_type'));
    return this.cookieService.get('user_type') === 'student';
  }

  isSupporter() {
    //console.log(this.cookieService.get('user_type'));
    return this.cookieService.get('user_type') === 'supporter';
  }

  ngOnInit(): void {
  }
  someMethod() {
    this.trigger.openMenu();
  }

  logout() {
    console.log('logged out');
    this.cookieService.delete('logged-in');
    this.cookieService.delete('user_id');
    this.cookieService.delete('user_type');
    console.log('logged out');
  }

  getAuth() {
    return this.auth;
  }

  blank() {}
}

