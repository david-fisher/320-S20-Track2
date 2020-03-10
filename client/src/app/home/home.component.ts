import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { STUDENTS} from '../mock-student-db';

@Component({
  selector: 'app-test',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
