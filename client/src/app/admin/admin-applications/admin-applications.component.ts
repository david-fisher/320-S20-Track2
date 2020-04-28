import { Component, OnInit } from '@angular/core';
import {APPLICATIONS} from './application';
import {Application} from './application';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.css']
})
export class AdminApplicationsComponent implements OnInit {

  constructor() { }

  get applications(): Array<Application> {
    return APPLICATIONS;
  }

  ngOnInit(): void {
  }
}
