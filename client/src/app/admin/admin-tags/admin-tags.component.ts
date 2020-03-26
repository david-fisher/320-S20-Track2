import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.css']
})
export class AdminTagsComponent implements OnInit {
  tagsList: string[] = ['Interviews', 'Technical Interviews', 'Python', 'Java', 'TypeScript', 'Resume Review', 'Google', 'Group Interview',
    'C++', 'Group Interviews'];
  constructor() { }

  ngOnInit(): void {
  }

}
