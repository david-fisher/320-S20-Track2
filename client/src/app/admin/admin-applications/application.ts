export interface Application {
  date: Date;
  name: string;
  supporter_type: string;
  employer: string;
  team: string;
  title: string;
}

// month starts at 0
const app1 = new Date(2020, 2, 23, 15, 20, 0, 0);
const app2 = new Date(2020, 2, 17, 11, 45, 0, 0);
const app3 = new Date(2020, 1, 11, 9, 10, 0, 0);


export const APPLICATIONS: Application[] = [
  {date: app1, name: 'Steven Smith', supporter_type: 'Alumni', employer: 'Amazon', team: 'Machine Learning', title: 'Lead Developer'},
  {date: app2, name: 'Joseph Jones', supporter_type: 'Professional Staff', employer: 'Umass Amherst',
    team: 'Computer Science Department', title: 'Professor'},
  {date: app3, name: 'Katy Kellogg', supporter_type: 'Student Staff', employer: 'Umass Amherst', team: 'Cereal Department',
    title: 'Professor'}
];
