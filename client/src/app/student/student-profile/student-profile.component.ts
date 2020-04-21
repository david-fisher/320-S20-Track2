import { Component, OnInit } from '@angular/core';
import { MatGridListModule} from '@angular/material/grid-list';

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
      PreferredName: 'John' ,
      LastName: 'Doe',
      Pronouns: 'He/Him/His' ,
      Major: 'Computer Science' ,
      GraduateYear: '2021' ,
      Resume: 'resume.pdf',
      GraduationYearList: ['2020', '2021', '2022', '2023', '2024'],
      GPA: '4.0',
      Email: 'johnd@umass.edu',
      GitHub: 'github.com/john',
      PersonalDescription: 'A brief personal description'
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
