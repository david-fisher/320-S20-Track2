import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  public today: any = new Date();
  public flag = true;
  public studentInfo =
    {
      studentName: 'Rukai',
      GraduateYear: 2021 ,
      spireID: '3140xxxx',
      Email: 'rukaixxx@umass.edu',
      GitHub: 'GitHub.com/Rukai'
    };

  constructor() { }

  ngOnInit(): void {
  }

  run() {
    this.flag = false;
  }
  submit() {
    alert('function not complete yet!');
  }

}
