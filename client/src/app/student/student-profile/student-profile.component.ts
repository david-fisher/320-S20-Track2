import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatGridListModule} from '@angular/material/grid-list';
import { StudentProfileService } from './student-profile.service';
import { StudentInfo } from './student-info';
import { ActivatedRoute } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../../auth/auth.service';


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
  public profileID = '';
  public userID = '';
  public canEdit = false;

  // hard coded things need to be updated by the lambdas
  public studentInfo: StudentInfo = {
    first_name: '',
    last_name: '',
    preferred_name: '',
    pronouns: '',
    major: '',
    GPA: 0,
    grad_year: 0,
    phone_number: 0,
    github_link: '',
    personal_description: '',
    };

  // for cancelling edits
  public studentInfoCopy: StudentInfo = {
    first_name: '',
    last_name: '',
    preferred_name: '',
    pronouns: '',
    major: '',
    GPA: 0,
    grad_year: 0,
    phone_number: 0,
    github_link: '',
    personal_description: '',
  };

  constructor(private activatedRoute: ActivatedRoute, private studentProfileService: StudentProfileService,
              private cookieService: CookieService) {
    this.profileID = this.activatedRoute.snapshot.params.appt_id;
    this.userID = this.cookieService.get('user_id');
    if (this.profileID.match(this.userID)) {
      this.canEdit = true;
    }
  }



  // importing student data
  showStudentProfile() {
    this.studentProfileService.getStudentProfile(this.profileID)
      .subscribe(data => {
        console.log(Object.values(data));
        this.studentInfo.first_name = Object.values(data)[0][3];
        this.studentInfo.last_name = Object.values(data)[0][4];
        this.studentInfo.preferred_name = Object.values(data)[0][5];
        this.studentInfo.pronouns = Object.values(data)[0][11];
        this.studentInfo.major = Object.values(data)[1][9];
        this.studentInfo.GPA = Object.values(data)[1][1];
        this.studentInfo.grad_year = Object.values(data)[1][2];
        this.studentInfo.phone_number = Object.values(data)[0][6];
        this.studentInfo.github_link = Object.values(data)[1][5];
        this.studentInfo.personal_description = Object.values(data)[0][10];
      });
  }

  // there's definitely a better way to do this, but this works for now
  // cloning to avoid aliasing
  clone() {
    this.studentInfoCopy.first_name = this.studentInfo.first_name;
    this.studentInfoCopy.last_name = this.studentInfo.last_name;
    this.studentInfoCopy.preferred_name = this.studentInfo.preferred_name;
    this.studentInfoCopy.pronouns = this.studentInfo.pronouns;
    this.studentInfoCopy.major = this.studentInfo.major;
    this.studentInfoCopy.GPA = this.studentInfo.GPA;
    this.studentInfoCopy.grad_year = this.studentInfo.grad_year;
    this.studentInfoCopy.phone_number = this.studentInfo.phone_number;
    this.studentInfoCopy.github_link = this.studentInfo.github_link;
    this.studentInfoCopy.personal_description = this.studentInfo.personal_description;
  }
  // resetting student info
  reset() {
    this.studentInfo.first_name = this.studentInfoCopy.first_name;
    this.studentInfo.last_name = this.studentInfoCopy.last_name;
    this.studentInfo.preferred_name = this.studentInfoCopy.preferred_name;
    this.studentInfo.pronouns = this.studentInfoCopy.pronouns;
    this.studentInfo.major = this.studentInfoCopy.major;
    this.studentInfo.GPA = this.studentInfoCopy.GPA;
    this.studentInfo.grad_year = this.studentInfoCopy.grad_year;
    this.studentInfo.phone_number = this.studentInfoCopy.phone_number;
    this.studentInfo.github_link = this.studentInfoCopy.github_link;
    this.studentInfo.personal_description = this.studentInfoCopy.personal_description;
    console.log("success");
  }


  ngOnInit(): void {
    this.showStudentProfile();
    console.log(this.studentInfo);
    console.log('test');
  }

/*
Boolean toggle flags
Each submit sends a PATCH request for the editable fields
 */
  runInformation() {
    this.informationFlag = false;
    this.clone();
  }
  submitInformation() {
    this.informationFlag = true;
    this.studentProfileService.patchStudentProfile({
      preferred_name: this.studentInfo.preferred_name,
      last_name: this.studentInfo.last_name,
      grad_year: this.studentInfo.grad_year,
      description: this.studentInfo.personal_description,
      pronouns: this.studentInfo.pronouns,
      program: this.studentInfo.major
    }).subscribe(data => {console.log(data); });
  }

  cancelInformation() {
    this.informationFlag = true;
    this.reset();
  }

  runDescription() {
    this.descriptionFlag = false;
    this.clone();
  }
  submitDescription() {
    this.descriptionFlag = true;
    this.studentProfileService.patchStudentProfile({
      description: this.studentInfo.personal_description
    }).subscribe(data => {console.log(data); });
  }

  cancelDescription() {
    this.descriptionFlag = true;
    this.reset();
  }

  runLinksFiles() {
    this.linksFilesFlag = false;
    this.clone();
  }
  submitLinksFiles() {
    this.linksFilesFlag = true;
    this.studentProfileService.patchStudentProfile({
      github_link: this.studentInfo.github_link
    }).subscribe(data => {console.log(data); });
  }

  cancelLinksFiles() {
    this.linksFilesFlag = true;
    this.reset();
  }

}
