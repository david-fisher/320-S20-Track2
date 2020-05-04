import {StudentAppointment} from "../../student/student-myappointments/appointments";

// month starts at 0
const app1 = new Date(2020, 3, 23, 15, 20, 0, 0);
const app2 = new Date(2020, 3, 17, 11, 45, 0, 0);
const app3 = new Date(2020, 1, 11, 9, 10, 0, 0);
const app4 = new Date(2020, 1, 15, 9, 10, 0, 0);


export const APPOINTMENTS: StudentAppointment[] = [
  {date: app1, type: 'Resume Help', supporter_name: 'Brian Smith', appt_id: '1', duration: '60', location: 'lederle 123', cancelled: false, rated: false, supporter_id: 1},
  {date: app2, type: 'Interview Help', supporter_name: 'John Doe', appt_id: '2', duration: '60', location: 'lederle 123', cancelled: false, rated: true, supporter_id: 2},
  {date: app3, type: 'Career Guidance', supporter_name: 'John Doe', appt_id: '3', duration: '60', location: 'lederle 123', cancelled: false, rated: false, supporter_id: 3},
  {date: app4, type: 'Job Search', supporter_name: 'David Fisher', appt_id: '1', duration: '60', location: 'lederle 123', cancelled: false, rated: false, supporter_id: 4}
];
