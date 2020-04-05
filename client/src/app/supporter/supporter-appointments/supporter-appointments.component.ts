import { Component, OnInit } from '@angular/core';
import {APPOINTMENTS} from './appointments';
import {Appointments} from './appointments';
import { Router } from '@angular/router';
@Component({
  selector: 'app-supporter-appointments',
  templateUrl: './supporter-appointments.component.html',
  styleUrls: ['./supporter-appointments.component.css']
})
export class SupporterAppointmentsComponent implements OnInit {

  constructor() { }

  get appointments(): Array<Appointments> {
    return APPOINTMENTS;
  }

  get date(): object{
    return new Date();
  }

  verify(appointment){
    alert("Are you sure you want to cancel");
    prompt( "Please state a reason for cancelation.");
    for (let x in APPOINTMENTS) {
      if ( APPOINTMENTS[x] === appointment){
        console.log(parseInt(x));
        APPOINTMENTS.splice( parseInt(x) , 1 );
      }
    }
  }

  ngOnInit(): void {
  }

}
