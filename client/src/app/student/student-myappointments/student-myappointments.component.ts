import {Component, OnInit} from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';
import {Appointments} from './appointments';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-myappointments',
  templateUrl: './student-myappointments.component.html',
  styleUrls: ['./student-myappointments.component.css']
})
export class StudentMyappointmentsComponent implements OnInit {



  constructor() {
  }


  get appointments(): Array<Appointments> {
    return APPOINTMENTS;
  }

  get date(): object {
    return new Date();
  }

  varify(appointment) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      prompt('Please state a reason for cancelation.');
      for (let x in APPOINTMENTS) {
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
