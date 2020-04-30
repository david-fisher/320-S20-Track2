import { Component, OnInit } from '@angular/core';
import {TICKETS} from './mock-tickets';
import {ReportTicket} from './report-ticket';
import {SupporterAppointment} from "../../supporter/supporter-appointments/appointments";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  tempTickets;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.tempTickets = this.Tickets;
  }

  get Tickets(): Array<ReportTicket> {
    const open: Array<ReportTicket> = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/reports/', {observe: 'response'}).subscribe(res => {
      console.log(Object.values(res));
      console.log("user ID:" + this.cookieService.get('user_id'));
      if(res.status == 200 && res.body != "") {
        for (const rep of Object.values(res.body)) {
          const newReport: ReportTicket = {
            date: new Date(rep[3].split("-")[0], rep[3].split("-")[1], rep[3].split("-")[2], rep[4].split(":")[0], rep[4].split(":")[1], rep[4].split(":")[2], 0),
            filedByID: rep[0],
            filedAgainstID: rep[1],
            report: rep[2]
          };
          open.push(newReport);
        }
      }
    });
    return open;
  }

  // get closedTickets(): Array<ReportTicket> {
  //   const closed: Array<ReportTicket> = [];
  //   for (const ticket of TICKETS) {
  //     if (ticket.status === 'Closed') {
  //       closed.push(ticket);
  //     }
  //   }
  //   return closed;
  // }

  closeTicket(ticket) {
    ticket.status = 'Closed';
  }

  ngOnInit(): void {
  }
}
