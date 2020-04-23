import { Component, OnInit } from '@angular/core';
import {TEST_APPOINTMENTS} from './appointments';
import {Appointment} from './appointments';
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
  userID;

  constructor(private http: HttpClient) {
    this.pageAppointments = this.appointments;
  }

  // get appointments(): Array<Appointments> {
  //   return TEST_APPOINTMENTS;
  // }

  get date(): object {
    return new Date();
  }

  get appointments(): Array<Appointment> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/1', {}).subscribe(res => {
      console.log(Object.values(res));
      for (const appt of Object.values(res)) {
        const newAppt : Appointment = {date: new Date(appt[2].split("-")[0], appt[2].split("-")[1], appt[2].split("-")[2], appt[3].split(":")[0], appt[3].split(":")[1], appt[3].split(":")[2], 0), type: "Meeting Type: "+appt[6], student: 'User-ID: '+appt[0], location: "Meeting Location", duration: appt[4]};
        result.push(newAppt);
      }
    });
    console.log(result);
    return result;
  }

  verify(appointment) {
    if (confirm('Are you sure you want to cancel?')) {
      prompt('Please state a reason for cancellation.');
      for (const x in TEST_APPOINTMENTS) {
        if (TEST_APPOINTMENTS[x] === appointment) {
          console.log(parseInt(x));
          TEST_APPOINTMENTS.splice(parseInt(x), 1);
        }
      }
    }
  }

  ngOnInit(): void {
  }

}
