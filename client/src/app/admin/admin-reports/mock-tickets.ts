import {ReportTicket} from './report-ticket';

// month starts at 0
const app1 = new Date(2020, 3, 24, 13, 30, 0, 0);
const app2 = new Date(2020, 4, 1, 18, 22, 0, 0);
const app3 = new Date(2021, 8, 2, 14, 54, 0, 0);

export const TICKETS: ReportTicket[] = [
  {date: app1, filedByID: 154, filedAgainstID: 213, report: 'Unprofessional behavior.'},
  {date: app2, filedByID: 316, filedAgainstID: 439, report: 'Did not show up to meeting, unexpectedly found in Tampa Bay.'},
  {date: app3, filedByID: 563, filedAgainstID: 641, report: 'Does not show competence in advertised areas of expertise.'}
];
