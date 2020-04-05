export interface Appointments {
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


export const APPOINTMENTS: Appointments[] = [
  {date: app1, type: 'Resume Help', student: 'Brian Smith', location: "Lederle 123"},
  {date: app2, type: 'Interview Help', student: 'John Doe', location: "Antonio's Pizza"},
  {date: app3, type: 'Career Guidance', student: 'John Doe', location: "Morril 234"},
  {date: app4, type: 'Job Search', student: 'David Fisher', location: "CS Building 105"}
];
