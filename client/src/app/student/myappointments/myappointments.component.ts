import { Component, OnInit } from '@angular/core';
import {APPOINTMENTS} from './mock-appointments';



@Component({
  selector: 'app-myappointments',
  templateUrl: './myappointments.component.html',
  styleUrls: ['./myappointments.component.css']
})
export class MyappointmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const today: Date = new Date();
    const upcomingApp = document.getElementById('next');
    const previousApps = document.getElementById('prev');
    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < APPOINTMENTS.length; x++) {
      console.log(APPOINTMENTS[x].date);
      if (APPOINTMENTS[x].date > today) {
        const newApp = document.createElement('div');
        newApp.style.border = 'solid';
        newApp.style.borderRadius = '5px';
        newApp.style.width = '700px';
        newApp.style.height = '50px';
        newApp.style.marginBottom = '20px';
        const text = document.createElement('h2');
        let innertext = APPOINTMENTS[x].date.getHours() + ':' + APPOINTMENTS[x].date.getMinutes() + '    ';
        innertext = innertext + APPOINTMENTS[x].date.getDate() + '//' + (APPOINTMENTS[x].date.getMonth() + 1) + '//20     ||  ';
        innertext = innertext + APPOINTMENTS[x].type + '   ||   ' + APPOINTMENTS[x].supporter;
        text.innerText = innertext;
        // text.style.textAlign = 'center';
        newApp.prepend(text);
        upcomingApp.appendChild(newApp);
        console.log('coming up');
      } else {
        const newApp = document.createElement('div');
        newApp.style.border = 'solid';
        newApp.style.borderRadius = '5px';
        newApp.style.width = '700px';
        newApp.style.height = '50px';
        newApp.style.marginBottom = '20px';
        const text = document.createElement('h2');
        let innertext = APPOINTMENTS[x].date.getHours() + ':' + APPOINTMENTS[x].date.getMinutes() + '    ';
        innertext = innertext + APPOINTMENTS[x].date.getDate() + '//' + (APPOINTMENTS[x].date.getMonth() + 1) + '//20     ||  ';
        innertext = innertext + APPOINTMENTS[x].type + '   ||   ' + APPOINTMENTS[x].supporter;
        text.innerText = innertext;
        // text.style.textAlign = 'center';
        newApp.prepend(text);
        previousApps.appendChild(newApp);
        console.log('past');
      }
    }
  }
}
