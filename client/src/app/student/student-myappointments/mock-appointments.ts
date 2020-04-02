import {Appointments} from './appointments';

// month starts at 0
const app1 = new Date(2020, 3, 23, 15, 20, 0, 0);
const app2 = new Date(2020, 3, 17, 11, 45, 0, 0);
const app3 = new Date(2020, 1, 11, 9, 10, 0, 0);


export const APPOINTMENTS: Appointments[] = [
  {date: app1, type: 'Resume Help', supporter: 'Brian Smith'},
  {date: app2, type: 'Interview Help', supporter: 'John Doe'},
  {date: app3, type: 'Career Guidance', supporter: 'John Doe'}
];
