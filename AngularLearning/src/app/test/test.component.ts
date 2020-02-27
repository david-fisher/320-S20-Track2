import { Component, OnInit } from '@angular/core';
import { Student } from '../student';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  student: Student = {
    id: 1,
    name: 'Student'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
