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
  graduationYears = [2020, 2021, 2022, 2023, 2024, 2025];

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
    linkedin_link: '',
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
    linkedin_link: '',
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
        this.studentInfo.grad_year = Object.values(data)[1][2].substring(0, 4);
        this.studentInfo.phone_number = Object.values(data)[0][6];
        this.studentInfo.github_link = Object.values(data)[1][5];
        this.studentInfo.linkedin_link = Object.values(data)[1][6];
        this.studentInfo.personal_description = Object.values(data)[0][10];
      });
  }

  // there's definitely a better way to do this, but this works for now
  // cloning from a to b to avoid aliasing
  clone(original, copy) {
    copy.first_name = original.first_name;
    copy.last_name = original.last_name;
    copy.preferred_name = original.preferred_name;
    copy.pronouns = original.pronouns;
    copy.major = original.major;
    copy.GPA = original.GPA;
    copy.grad_year = original.grad_year;
    copy.phone_number = original.phone_number;
    copy.github_link = original.github_link;
    copy.linkedin_link = original.linkedin_link;
    copy.personal_description = original.personal_description;
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
    this.clone(this.studentInfo, this.studentInfoCopy);
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
    }, this.profileID).subscribe(data => {console.log(data); });
  }

  cancelInformation() {
    this.informationFlag = true;
    this.clone(this.studentInfoCopy, this.studentInfo);
  }

  runDescription() {
    this.descriptionFlag = false;
    this.clone(this.studentInfo, this.studentInfoCopy);
  }
  submitDescription() {
    this.descriptionFlag = true;
    this.studentProfileService.patchStudentProfile({
      description: this.studentInfo.personal_description
    }, this.profileID).subscribe(data => {console.log(data); });
  }

  cancelDescription() {
    this.descriptionFlag = true;
    this.clone(this.studentInfoCopy, this.studentInfo);
  }

  runLinksFiles() {
    this.linksFilesFlag = false;
    this.clone(this.studentInfo, this.studentInfoCopy);
  }
  submitLinksFiles() {
    this.linksFilesFlag = true;
    this.studentProfileService.patchStudentProfile({
      github_link: this.studentInfo.github_link,
      linkedin_link: this.studentInfo.linkedin_link
    }, this.profileID).subscribe(data => {console.log(data); });
  }

  cancelLinksFiles() {
    this.linksFilesFlag = true;
    this.clone(this.studentInfoCopy, this.studentInfo);
  }

}
