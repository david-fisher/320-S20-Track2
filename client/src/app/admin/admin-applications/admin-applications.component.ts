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

  // get applications(): Array<Application> {
  //   return APPLICATIONS;
  // }

  get applications(): Array<Application> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/supporters/', {observe: 'response'}).subscribe(res => {
      // console.log(Object.values(res));
      // console.log(Object.values(res)[6]);
      const sups = Object.values(res)[6];
      if(res.status === 200) {
        for(let k of Object.keys(sups)){
          // console.log(k);
          // console.log(sups[k]);
          // console.log(sups[k].first_name);
          const app: Application = {
            user_id: parseInt(k),
            name: sups[k].first_name + " " + sups[k].last_name,
            employer: sups[k].current_employer,
            title: sups[k].title
          };
          if(sups[k].request_supporter){
            result.push(app);
          }
        }
      }
    });
    // console.log(result);
    return result;
  }

  approve(user_id) {
    this.approveBody = {};
    this.approveBody.request_supporter = false;
    this.approveBody.active_account = true;
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + user_id, this.approveBody).subscribe(res => {
      // console.log(this.approveBody);
      // console.log(res);
      // console.log(user_id);
    });
  }

  deny(user_id) {
    this.denyBody = {};
    this.denyBody.request_supporter = false;
    this.denyBody.active_account = false;
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + user_id, this.denyBody).subscribe(res => {
      // console.log(this.denyBody);
      // console.log(res);
      // console.log(user_id);
    });
  }

  ngOnInit(): void {
  }
}
