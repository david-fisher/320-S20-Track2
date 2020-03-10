import {Component, OnInit, ViewChild} from '@angular/core';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  isLogin = false;
  constructor() { }

  ngOnInit(): void {
  }
  someMethod() {
    this.trigger.openMenu();
  }

  login() {
    this.isLogin = true;
  }

  logout() {
    this.isLogin = false;
  }

}

