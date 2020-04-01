import {Component, OnInit} from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';
import {Appointments} from './appointments';

@Component({
  selector: 'app-myappointments',
  templateUrl: './myappointments.component.html',
  styleUrls: ['./myappointments.component.css']
})
export class MyappointmentsComponent implements OnInit {

  constructor() { }

  get appointments(): Array<Appointments> {
    return APPOINTMENTS;
  }

  ngOnInit(): void {
  }
}
