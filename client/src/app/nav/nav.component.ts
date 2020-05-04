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
  userID = '';
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(private cookieService: CookieService, private auth: AuthService) {
  }
  isStudent() {
    /*
    Checks if the user is a student
     */
    return this.cookieService.get('user_type') === 'student';
  }

  isSupporter() {
    /*
    Checks if the user is a supporter
     */
    return this.cookieService.get('user_type') === 'supporter';
  }

  isAdmin() {
    /*
    Checks if the user is an admin
     */
    return this.cookieService.get('is_admin');
  }


  ngOnInit(): void {
  }

  getUserId() {
    this.userID = this.cookieService.get('user_id');
  }

  logout() {
    /*
    Run upon clicking log out.  Deletes necessary cookies.
     */
    console.log('logged out');
    this.cookieService.delete('logged-in');
    this.cookieService.delete('user_id');
    this.cookieService.delete('user_type');
  }

  getAuth() {
    /*
    Gets auth object from AuthService
     */
    return this.auth;
  }

  blank() {}
}

