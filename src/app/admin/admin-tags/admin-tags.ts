import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.html',
  styleUrls: ['./admin-tags.css']
})
export class AdminTagsComponent {
  tagsList: string[] = ['Interviews', 'Technical Interviews', 'Python', 'Java', 'TypeScript', 'Resume Review', 'Google', 'Group Interview',
    'C++', 'Group Interviews'];
}

