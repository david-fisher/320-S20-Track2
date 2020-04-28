import {Component, OnInit} from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';
import { HttpClient } from '@angular/common/http';
import {StudentAppointment} from "../../student/student-myappointments/appointments";

@Component({
  selector: 'app-myappointments',
  templateUrl: './student-myappointments.component.html',
  styleUrls: ['./student-myappointments.component.css']
})
export class StudentMyappointmentsComponent implements OnInit {

  appointments;

  constructor(private http: HttpClient) {
    this.appointments = this.getAppointments;
  }

  get getAppointments(): Array<StudentAppointment> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/1', {}).subscribe(res => {
      console.log(Object.values(res));
      for (const appt of Object.values(res)) {
        const newAppt : StudentAppointment = {date: new Date(appt[2].split("-")[0], appt[2].split("-")[1], appt[2].split("-")[2], appt[3].split(":")[0], appt[3].split(":")[1], appt[3].split(":")[2], 0), type: "Meeting Type: "+appt[5], location: "Meeting Location", duration: appt[4], appt_id: appt[0], cancelled: appt[6], supporter_name: appt[7]};
        result.push(newAppt);
      }
    });
    console.log(result);
    return result;
  }

  get date(): object {
    return new Date();
  }

  varify(appointment) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const arr = prompt('Please state a reason for cancelation.');
      console.log(arr);
      console.log(appointment);
      this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/cancel_appt/1', {}).subscribe(res => {
        console.log(Object.values(res));
      });
    }
  }

  ngOnInit(): void {
  }
}
