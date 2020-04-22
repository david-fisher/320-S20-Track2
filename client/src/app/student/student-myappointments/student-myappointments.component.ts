import {Component, OnInit} from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';
import {Appointments} from './appointments';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-myappointments',
  templateUrl: './student-myappointments.component.html',
  styleUrls: ['./student-myappointments.component.css']
})
export class StudentMyappointmentsComponent implements OnInit {


  public test1;

  constructor(private http: HttpClient) {
  }

  test() { // Function which you can call to make a request
    const headers = new HttpHeaders().set('user_id', '2');
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/supporters', { headers }).subscribe(res => {
      console.log(res);
      this.test1 = res;
    });
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
