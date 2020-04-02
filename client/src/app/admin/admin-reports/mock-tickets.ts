import {ReportTickets} from './report-ticket';

// month starts at 0
const app1 = new Date(2020, 3, 24, 13, 30, 0, 0);
const app2 = new Date(2020, 4, 1, 18, 22, 0, 0);
const app3 = new Date(2021, 8, 2, 14, 54, 0, 0);

export const TICKETS: ReportTickets[] = [
  {date: app1, ticketID: 283133, status: 'Open', filedBy: 'John Doe', filedAgainst: 'Jane Doe', report: 'Unprofessional behavior.'},
  {date: app2, ticketID: 121187, status: 'Closed', filedBy: 'B. Belichick', filedAgainst: 'T. Brady', report: 'Did not show ' +
      'up to meeting, unexpectedly found in Tampa Bay.'},
  {date: app3, ticketID: 376388, status: 'Open', filedBy: 'B. Marchand', filedAgainst: 'A. Matthews', report: 'Does not ' +
      'show competence in advertised areas of expertise.'}
];
