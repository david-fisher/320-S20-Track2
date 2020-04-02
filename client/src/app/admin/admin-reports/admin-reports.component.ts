import { Component, OnInit } from '@angular/core';
import {TICKETS} from './mock-tickets';
import {ReportTickets} from './report-ticket';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  constructor() {
  }

  get openTickets(): Array<ReportTickets> {
    const open: Array<ReportTickets> = [];
    for (const ticket of TICKETS) {
      if (ticket.status === 'Open') {
        open.push(ticket);
      }
    }
    return open;
  }

  get closedTickets(): Array<ReportTickets> {
    const closed: Array<ReportTickets> = [];
    for (const ticket of TICKETS) {
      if (ticket.status === 'Closed') {
        closed.push(ticket);
      }
    }
    return closed;
  }

  closeTicket(ticket) {
    ticket.status = 'Closed';
  }

  ngOnInit(): void {
  }
}
