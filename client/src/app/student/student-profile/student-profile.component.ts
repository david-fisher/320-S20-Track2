import { Component, OnInit } from '@angular/core';
import { MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

/*To Implement:
Click/listening instead of multiple functions
Asynchronicity for Http requests
Editing avatar
 */
export class StudentProfileComponent implements OnInit {

  public today: any = new Date();
  public informationFlag = true;
  public personalDescriptionFlag = true;
  public linksFilesFlag = true;

  public studentInfo =
    {
      PreferredName: 'John' ,
      LastName: 'Doe',
      Pronouns: 'He/Him/His' ,
      Major: 'Computer Science' ,
      GraduationYear: '2021' ,
      GraduationYearList: ['2020', '2021', '2022', '2023', '2024'],
      Resume: 'resume.pdf',
      GPA: '4.0',
      Email: 'johnd@umass.edu',
      Links: 'github.com/john',
      PersonalDescription: 'A brief personal description'
    };

  constructor() { }

  ngOnInit(): void {
  }

  runInformation() {
    this.informationFlag = false;
  }
  submitInformation() {
    this.informationFlag = true;
  }

  runPersonalDescription() {
    this.personalDescriptionFlag = false;
  }
  submitPersonalDescription() {
    this.personalDescriptionFlag = true;
  }

  runLinksFiles() {
    this.linksFilesFlag = false;
  }
  submitLinksFiles() {
    this.linksFilesFlag = true;
  }

}
