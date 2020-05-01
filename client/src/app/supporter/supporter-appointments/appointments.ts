export interface SupporterAppointment {
  appt_id: string;
  duration: string;
  date: Date;
  type: string;
  student: string;
  location: string;
  cancelled: boolean;
}

export interface SupporterFeedback {
  question: string;
  answer: string;
  rating: number;
  recommend: boolean;
}

// // month starts at 0
// const app1 = new Date(2020, 3, 23, 15, 20, 0, 0);
// const app2 = new Date(2020, 3, 17, 11, 45, 0, 0);
// const app3 = new Date(2020, 1, 11, 9, 10, 0, 0);
// const app4 = new Date(2020, 1, 15, 9, 10, 0, 0);


// month starts at 0
const app1 = new Date(2020, 9, 23, 15, 20, 0, 0);
const app2 = new Date(2020, 3, 17, 11, 45, 0, 0);
const app3 = new Date(2020, 1, 11, 9, 10, 0, 0);
const app4 = new Date(2020, 1, 15, 9, 10, 0, 0);


export const TEST_APPOINTMENTS: SupporterAppointment[] = [
  {date: app1, type: 'Resume Help', student: 'Brian Smith', appt_id: '1', duration: '60', location: 'lederle 123', cancelled: false},
  {date: app2, type: 'Interview Help', student: 'John Doe', appt_id: '2', duration: '60', location: 'lederle 124', cancelled: false},
  {date: app3, type: 'Career Guidance', student: 'John Doe', appt_id: '3', duration: '60', location: 'lederle 125', cancelled: false},
  {date: app4, type: 'Job Search', student: 'Daniel Fisher', appt_id: '1', duration: '60', location: 'lederle 126', cancelled: false}
];
