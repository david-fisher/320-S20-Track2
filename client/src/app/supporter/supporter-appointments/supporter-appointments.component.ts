import { Component, OnInit } from '@angular/core';
import {APPOINTMENTS} from './appointments';
import {Appointments} from './appointments';
import { Router } from '@angular/router';
import {InterestTags} from "../../admin/admin-tags/interest-tag";
import {HttpClient, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-supporter-appointments',
  templateUrl: './supporter-appointments.component.html',
  styleUrls: ['./supporter-appointments.component.css']
})
export class SupporterAppointmentsComponent implements OnInit {

  pageAppointments;

  constructor(private http: HttpClient) {
    this.pageAppointments = this.appointments;
  }

  // get appointments(): Array<Appointments> {
  //   return APPOINTMENTS;
  // }

  get date(): object {
    return new Date();
  }

  get appointments(): Array<Appointments> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/1', {}).subscribe(res => {
      console.log(res)
      // @ts-ignore
      for (const appt of res) {
        const newAppt = {name: appt[1]}
        result.push(newAppt);
      }
    });
    console.log(result);
    return result;
  }

  verify(appointment) {
    if (confirm('Are you sure you want to cancel?')) {
      prompt('Please state a reason for cancellation.');
      for (const x in APPOINTMENTS) {
        if (APPOINTMENTS[x] === appointment) {
          console.log(parseInt(x));
          APPOINTMENTS.splice(parseInt(x), 1);
        }
      }
    }
  }

  ngOnInit(): void {
  }

}
