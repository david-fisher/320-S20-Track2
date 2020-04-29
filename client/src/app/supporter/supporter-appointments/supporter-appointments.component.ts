import { Component, OnInit } from '@angular/core';
import {SupporterAppointment} from './appointments';
import {SupporterFeedback} from './appointments';
import {TEST_APPOINTMENTS} from "./appointments";
import { Router } from '@angular/router';
import {InterestTags} from "../../admin/admin-tags/interest-tag";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-supporter-appointments',
  templateUrl: './supporter-appointments.component.html',
  styleUrls: ['./supporter-appointments.component.css']
})
export class SupporterAppointmentsComponent implements OnInit {

  tempAppointments;
  tempFeedback;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.tempAppointments = this.appointments;
    this.tempFeedback = this.feedback(2);
  }

  get date(): object {
    return new Date();
  }

  get appointments(): Array<SupporterAppointment> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/' + this.cookieService.get('user_id'), {observe: 'response'}).subscribe(res => {
      console.log(Object.values(res));
      console.log("user ID:" + this.cookieService.get('user_id'));
      if(res.status != 404) {
        for (const appt of Object.values(res)) {
          const newAppt: SupporterAppointment = {
            date: new Date(appt[2].split("-")[0], appt[2].split("-")[1], appt[2].split("-")[2], appt[3].split(":")[0], appt[3].split(":")[1], appt[3].split(":")[2], 0),
            type: appt[9],
            student: appt[7] + " " + appt[8],
            location: appt[10],
            duration: appt[4],
            appt_id: appt[0],
            cancelled: appt[6]
          };
          // if(!newAppt.cancelled) {
          //   result.push(newAppt);
          // }
        }
      }
    });
    return result;
  }

  feedback(appt_id): SupporterFeedback {
    const result : SupporterFeedback = {questions: ["q1", "q2"], answers: ["a1", "a2"], rating: appt_id, recommend: true};
    console.log(result);
    return result;
  }

  // feedback(appt_id): SupporterFeedback {
  //   //const result = {} as SupporterFeedback;
  //   const result : SupporterFeedback = {questions: ["q1", "q2"], answers: ["a1", "a2"], rating: 0, recommend: true};
  //   const qlist  = [];
  //   const alist = [];
  //   this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/'+appt_id, {}).subscribe(res => {
  //     console.log(Object.values(res));
  //     for (const appt of Object.values(res)) {
  //       for(const qapair of appt[3]) {
  //         qlist.push(qapair[0]);
  //         alist.push(qapair[1]);
  //       }
  //       const result : SupporterFeedback = {questions: qlist, answers: alist, rating: appt[1], recommend: appt[2]};
  //     }
  //   });
  //
  //   console.log(result);
  //   return result;
  // }

  verify(appointment) {
    if (confirm('Are you sure you want to cancel?')) {
      prompt('Please state a reason for cancellation.');
      for (const x in this.tempAppointments) {
        if (this.tempAppointments[x] === appointment) {
          this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/' + appointment.appt_id, {}).subscribe(res => {
            console.log(Object.values(res));
            console.log(appointment.appt_id);
          });
          this.tempAppointments.splice(parseInt(x), 1);
          console.log(x);
        }
      }
    }
  }

  ngOnInit(): void {
  }

}
