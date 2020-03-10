import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from "../auth/auth.service";




@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(private cookieService: CookieService, private auth: AuthService) { }

  ngOnInit(): void {
  }
  someMethod() {
    this.trigger.openMenu();
  }

  logout() {
    console.log('logged out');
    this.cookieService.delete('logged-in');
    location.reload();
    console.log('logged out');
  }

  getAuth() {
    return this.auth;
  }


}

