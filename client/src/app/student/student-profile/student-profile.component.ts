import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatGridListModule} from '@angular/material/grid-list';
import { StudentProfileService } from './student-profile.service';
import { StudentInfo } from './student-info';

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
  public informationFlag = true;
  public descriptionFlag = true;
  public linksFilesFlag = true;

  // hard coded things need to be updated by the lambdas
  public studentInfo: StudentInfo = {
    first_name: '',
    last_name: '',
    preferred_name: '',
    pronouns: 'He/Him/His',
    major: 'Computer Science',
    GPA: 0,
    grad_year: 0,
    email: '',
    phone_number: 0,
    github_link: '',
    personal_description: 'I am a Computer Science student',
    };


  constructor(private studentProfileService: StudentProfileService) { }

  showStudentProfile() {
    this.studentProfileService.getStudentProfile()
      .subscribe(data => {
        console.log(Object.values(data));
        this.studentInfo.first_name = Object.values(data)[0][3];
        this.studentInfo.last_name = Object.values(data)[0][4];
        this.studentInfo.preferred_name = Object.values(data)[0][5];
        // pronouns: '',
        //   major: '',
        this.studentInfo.GPA = Object.values(data)[1][1];
        this.studentInfo.grad_year = Object.values(data)[1][2];
        this.studentInfo.email = Object.values(data)[0][1];
        this.studentInfo.phone_number = Object.values(data)[0][6];
        this.studentInfo.github_link = Object.values(data)[1][5];
        // personal_description: 'I am a Computer Science student',
      });
  }


  ngOnInit(): void {
    this.showStudentProfile();
    console.log(this.studentInfo);
    console.log('test');
  }

/*
Boolean toggle flags
 */
  runInformation() {
    this.informationFlag = false;
  }
  submitInformation() {
    this.informationFlag = true;
    this.studentProfileService.patchStudentProfile({
      preferred_name: this.studentInfo.preferred_name,
      last_name: this.studentInfo.last_name,
      grad_year: this.studentInfo.grad_year
    }).subscribe(data => {console.log(data); });
  }

  runDescription() {
    this.descriptionFlag = false;
  }
  submitDescription() {
    this.descriptionFlag = true;
  }

  runLinksFiles() {
    this.linksFilesFlag = false;
  }
  submitLinksFiles() {
    this.linksFilesFlag = true;
    this.studentProfileService.patchStudentProfile({
      github_link: this.studentInfo.github_link
    }).subscribe(data => {console.log(data); });
  }

}
