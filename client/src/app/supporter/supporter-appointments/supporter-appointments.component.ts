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
  overwrittenAvail;
  body;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.body = {};
    this.overwrittenAvail = {};
    this.tempAppointments = this.appointments;
    this.tempFeedback = this.feedback(2);
    console.log(this.tempFeedback);
  }

  get date(): object {
    return new Date();
  }

  get appointments(): Array<SupporterAppointment> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/' + this.cookieService.get('user_id'), {observe: 'response'}).subscribe(res => {
      console.log(Object.values(res));
      if(res.status === 200 && res.body !== "") {
        for (const appt of Object.values(res)[6]) {
          const newAppt: SupporterAppointment = {
            date: new Date(appt[2].split("-")[0], appt[2].split("-")[1], appt[2].split("-")[2], appt[3].split(":")[0], appt[3].split(":")[1], appt[3].split(":")[2], 0),
            type: appt[9],
            student: appt[7] + " " + appt[8],
            location: appt[10],
            duration: appt[4],
            appt_id: appt[0],
            cancelled: appt[6]
          };
          result.push(newAppt);
          // if(!newAppt.cancelled) {
          //   result.push(newAppt);
          // }
        }
      }
    });
    console.log(result);
    //console.log(result[0]);
    return result;
  }

  feedback(appt_id): SupporterFeedback {
    const result : SupporterFeedback = {question: "What can I do to improve?", answer: "More cowbell.", rating: appt_id, recommend: true};
    console.log(result);
    return result;
  }



  // feedback(appt_id): SupporterFeedback {
  //   //const result = {} as SupporterFeedback;
  //   const result : SupporterFeedback = {question: "What can I do to improve?", answer: "More cowbell.", rating: appt_id, recommend: true};
  //
  //   this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/'+appt_id, {}).subscribe(res => {
  //     console.log(Object.values(res));
  //     const result : SupporterFeedback = {question: res[5], answer: res[6], rating: res[2], recommend: res[3]};
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

          const endDate = appointment.date;
          endDate.setMinutes(endDate.getMinutes() + 20);
          this.overwrittenAvail.start_time = appointment.date.format('HHMM');
          this.overwrittenAvail.end_time = (endDate).format('HHMM');
          this.overwrittenAvail.appt_date = appointment.date.format('DDMMYY');
          this.body.availability_delete = [];
          this.body.availability_delete.push(this.overwrittenAvail);

          this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.cookieService.get('user_id'), this.body).subscribe(res => {
            console.log(Object.values(res));
            console.log(appointment.appt_id);
          });

        }
      }
    }
  }

  ngOnInit(): void {
  }

}
