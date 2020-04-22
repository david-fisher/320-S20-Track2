import { Component, OnInit } from '@angular/core';
import {APPOINTMENTS} from './appointments';
import {Appointments} from './appointments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {InterestTags} from '../../admin/admin-tags/interest-tag';

@Component({
  selector: 'app-supporter-appointments',
  templateUrl: './supporter-appointments.component.html',
  styleUrls: ['./supporter-appointments.component.css']
})
export class SupporterAppointmentsComponent implements OnInit {
  public test1;
  constructor(private http: HttpClient) {
    this.test1 = this.test;
  }

  get appointments(): Array<Appointments> {
    return APPOINTMENTS;
  }

  get date(): object {
    return new Date();
  }

  test() { // Function which you can call to make a request
    console.log('Are we live?');
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments').subscribe(res => {
      console.log(res);
      this.test1 = res;
    });
  }

  verify(appointment) {
    if (confirm('Are you sure you want to cancel?')) {
      prompt('Please state a reason for cancelation.');
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
