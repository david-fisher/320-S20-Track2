import {Component, OnInit} from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';
import { HttpClient } from '@angular/common/http';
import {StudentAppointment} from "../../student/student-myappointments/appointments";
import {SupporterAppointment} from "../../supporter/supporter-appointments/appointments";

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
        const newAppt : StudentAppointment = {date: new Date(appt[2].split("-")[0], appt[2].split("-")[1], appt[2].split("-")[2], appt[3].split(":")[0], appt[3].split(":")[1], appt[3].split(":")[2], 0), type: appt[9], supporter_name: appt[7] + " " + appt[8], location: appt[10], duration: appt[4], appt_id: appt[0], cancelled: appt[6]};
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
    if (confirm('Are you sure you want to cancel?')) {
      prompt('Please state a reason for cancellation.');
      for (const x in this.appointments) {
        if (this.appointments[x] === appointment) {
          this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/' + appointment.appt_id, {}).subscribe(res => {
            console.log(Object.values(res));
            console.log(appointment.appt_id);
          });
          this.appointments.splice(parseInt(x), 1);
          console.log(x);
        }
      }
    }
  }

  ngOnInit(): void {
  }
}
