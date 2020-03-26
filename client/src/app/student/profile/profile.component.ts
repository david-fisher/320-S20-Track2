import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public today: any = new Date();
  public flag = true;
  public studentInfo =
    {
      studentName: 'Rukai',
      GraduateYear: 2021 ,
      GPA: '1.0 :(' ,
      spireID: '3140xxxx',
      Email: 'rukaixxx@umass.edu',
      GitHub: 'GitHub.com/Rukai'
    };

  constructor() { }

  ngOnInit(): void {
  }

  run() {
    alert('Function not complete yet');
    this.flag = false;
  }

}
