import {Component, OnInit} from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';
import {Appointments} from './appointments';

@Component({
  selector: 'app-myappointments',
  templateUrl: './student-myappointments.component.html',
  styleUrls: ['./student-myappointments.component.css']
})
export class StudentMyappointmentsComponent implements OnInit {

  constructor() { }

  get appointments(): Array<Appointments> {
    return APPOINTMENTS;
  }

  ngOnInit(): void {
  }
}
