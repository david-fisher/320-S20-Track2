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
      FirstName: 'Rukai',
      LastName: 'Cai',
      PreferredName: 'RK' ,
      Identity: 'Student',
      GraduateYear: '2021' ,
      Resume: '',
      GraduationYearList: ['2020', '2021', '2022', '2023', '2024'],
      spireID: '3140xxxx',
      Email: 'rukaixxx@umass.edu',
      GitHub: 'GitHub.com/Rukai',
      selfDescription: ''
    };

  constructor() { }

  ngOnInit(): void {
  }

  run() {
    this.flag = false;
  }
  submit() {
    /*
    let nameDom:any = document.getElementById('Name ');
    this.studentInfo.studentName = nameDom.value;
     */
    this.flag = true;
  }

}
