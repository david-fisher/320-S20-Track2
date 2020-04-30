import { Component, OnInit } from '@angular/core';
import {APPLICATIONS} from './application';
import {Application} from './application';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {SupporterAppointment} from "../../supporter/supporter-appointments/appointments";

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.css']
})
export class AdminApplicationsComponent implements OnInit {

  tempApplications;
  approveBody;
  denyBody;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.tempApplications = this.applications;
  }

  get applications(): Array<Application> {
    return APPLICATIONS;
  }

  // get applications(): Array<Application> {
  //   const result = [];
  //   this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/supporters/', {observe: 'response'}).subscribe(res => {
  //     console.log(Object.values(res));
  //     if(res.status === 200 && res.body !== "") {
  //       for (const app of Object.values(res)[6]) {
  //         const newApp: Application = {
  //           user_id: app[0],
  //           name: app[1] + " " + app[2],
  //           supporter_type: app[3],
  //           location: app[6],
  //           employer: app[4],
  //           title: app[5]
  //         };
  //         result.push(newApp);
  //       }
  //     }
  //   });
  //   return result;
  // }

  approve(user_id) {
    this.approveBody = {};
    this.approveBody.request_supporter = false;
    this.approveBody.active_account = true;
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + user_id, this.approveBody).subscribe(res => {
      console.log(res);
    });
  }

  deny(user_id) {
    this.denyBody = {};
    this.denyBody.request_supporter = false;
    this.denyBody.active_account = false;
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + user_id, this.denyBody).subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit(): void {
  }
}
