export interface Application {
  name: string;
  user_id: number;
  employer: string;
  title: string;
}

export const APPLICATIONS: Application[] = [
  {name: 'Steven Smith', user_id: 1, employer: 'Amazon', title: 'Lead Developer'},
  {name: 'Joseph Jones', user_id: 2, employer: 'Umass Amherst', title: 'Professor'},
  {name: 'Katy Kellogg', user_id: 3,  employer: 'Umass Amherst', title: 'Professor'}
];
