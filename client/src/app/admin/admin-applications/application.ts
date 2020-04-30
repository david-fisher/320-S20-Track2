export interface Application {
  name: string;
  user_id: number;
  supporter_type: string;
  employer: string;
  title: string;
  location: string;
}

export const APPLICATIONS: Application[] = [
  {name: 'Steven Smith', user_id: 1, supporter_type: 'Alumni', employer: 'Amazon', title: 'Lead Developer', location: 'Online'},
  {name: 'Joseph Jones', user_id: 2, supporter_type: 'Professional Staff', employer: 'Umass Amherst', title: 'Professor', location: 'Dubois 225'},
  {name: 'Katy Kellogg', user_id: 3, supporter_type: 'Student Staff', employer: 'Umass Amherst', title: 'Professor', location: 'Lederle A201'}
];
