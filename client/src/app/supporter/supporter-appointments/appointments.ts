export interface Appointment {
  appt_id: string;
  duration: string;
  date: Date;
  type: string;
  student: string;
  location: string;
}

// month starts at 0
const app1 = new Date(2020, 3, 23, 15, 20, 0, 0);
const app2 = new Date(2020, 3, 17, 11, 45, 0, 0);
const app3 = new Date(2020, 1, 11, 9, 10, 0, 0);
const app4 = new Date(2020, 1, 15, 9, 10, 0, 0);
