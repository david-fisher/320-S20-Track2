import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { STUDENTS} from '../mock-student-db';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  selectedStudent: Student;
  students = STUDENTS;
  student: Student = {
    id: 1,
    name: 'Student',
    condition: false,
  };

  onSelect(student: Student): void {
    this.selectedStudent = student;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
