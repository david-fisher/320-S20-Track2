import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-test',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  test() {
    console.log(this.cookieService.get('user_id'));
  }
  ngOnInit(): void {
  }

}
