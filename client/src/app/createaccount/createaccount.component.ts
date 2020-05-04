import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators, ValidatorFn} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {requireCheckboxesToBeCheckedValidator} from './require-checkboxes-to-be-checked.validator';
import * as CryptoJS from 'crypto-js';
import {Observable} from "rxjs";
import {InterestTags} from "../admin/admin-tags/interest-tag";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})

export class CreateaccountComponent implements OnInit {
  userType: boolean; // true if create student selected , false if supporter
  typeOfUser; // either 'student' or 'supporter' depending which button the user pushed on /login
  hide = true; // used for displaying or hiding the password field
  formSupporterGroup: FormGroup; // FormGroup for supporter form
  formStudentGroup: FormGroup; // FormGroup for student form
  titleAlert: string = 'This field is required'; // displayed when required field not filled in
  post: any = ''; // holds the form output

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private router: Router, private http: HttpClient) {
    this.userType = this.activatedRoute.snapshot.params.type === 'student';
    this.typeOfUser = this.activatedRoute.snapshot.params.type;
  }

  ngOnInit() {
    /*
    Run when page navigated to, creates student and supporter forms
     */
    this.createSupporterForm();
    this.createStudentForm();
  }

  createSupporterForm() {
    /*
    Builds supporter form with necessary fields and validators
     */
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formSupporterGroup = this.formBuilder.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'preferredName': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkPassword]],
      'pronouns': [null, Validators.required],
      'phoneNum': [null],
      'currentEmployer': [null],
      'userTitle': [null],
      supporterTypes: new FormGroup ({
        'Alumni': new FormControl(false),
        'Student Staff': new FormControl(false),
        'Faculty': new FormControl(false),
        'Professional Staff': new FormControl(false),
        'Other': new FormControl(false),
      }, requireCheckboxesToBeCheckedValidator(this.userType))
    });
  }

  createStudentForm() {
    /*
    Builds student form with necessary fields and validators
     */
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formStudentGroup = this.formBuilder.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'preferredName': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkPassword]],
      'pronouns': [null, Validators.required],
      'college': [null, Validators.required],
      'program': [null, Validators.required],
      'job_search': [null],
      'work_auth': [null],
      'phoneNum': [null],
      'gpa': [null],
      'gradYear': [null, Validators.required],
      'is_undergrad': [null, Validators.required],
      'github': [null],
      'linkedin': [null]
    });
  }

  get first_name() {
    /*
    Returns the user's inputted first name
     */
    return (this.userType ? this.formStudentGroup.get('first_name') as FormControl : this.formSupporterGroup.get('first_name') as FormControl)
  }

  get last_name() {
    /*
    Returns the user's inputted last name
     */
    return (this.userType ? this.formStudentGroup.get('last_name') as FormControl : this.formSupporterGroup.get('last_name') as FormControl)
  }

  get preferred_name() {
    /*
    Returns the user's inputted preferred name
     */
    return (this.userType ? this.formStudentGroup.get('preferredName') as FormControl : this.formSupporterGroup.get('preferredName') as FormControl)
  }

  onUploadClicked(data: any) {
    console.log(data);
  }


  checkPassword(control) {
    /*
    Checks if the password field was filled and if the password is at least eight characters and has one uppercase letter and one number
     */
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorEmail() {
    /*
    Returns the error message depending on the issue with the email
     */
    if (this.userType) {
      return this.formStudentGroup.get('email').hasError('required') ? 'Field is required' :
        this.formStudentGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' : '';
    } else {
      return this.formSupporterGroup.get('email').hasError('required') ? 'Field is required' :
        this.formSupporterGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' : '';
    }

  }

  getErrorPassword() {
    /*
    Returns the error message depending on the issue with the password
     */
    if (this.userType) {
      return this.formStudentGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
        this.formStudentGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
    } else {
      return this.formSupporterGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
        this.formSupporterGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
    }
  }

  onSubmit(post) {
    /*
    Run when the submit button is clicked, gets the form data and runs sendData()
     */
    this.post = post;
    this.sendData();
  }

  sendData() {
    /*
    Sends create form fields to database with POST to /account.

    On POST success:
      - Display success dialog

    On POST fail:
      - Display error dialog depending on the issue
     */


    let supporterTypes;
    /*
     Converts {supporterType1: false, supporterType2: true, supporterType3: true} into

     ['supporterType2', 'supporterType3']
     */
    if (!this.userType) {
      supporterTypes = [];
      for (const key in this.post['supporterTypes']) {
        if (this.post['supporterTypes'].hasOwnProperty(key)) {
          if (this.post['supporterTypes'][key]) {
            supporterTypes.push(key);
          }
        }
      }
    }
    console.log(supporterTypes);
    let email_split = this.post['email'].split('@');
    let email = email_split[0] + '@' + email_split[1].toLowerCase();
    let data = {};
    if (this.userType) { // student
      data = {
        'kind': this.typeOfUser,
        'first_name': this.post['first_name'],
        'last_name': this.post['last_name'],
        'preferred_name': this.post['preferredName'],
        'email': CryptoJS.SHA3(email, { outputLength: 224 }).toString(CryptoJS.enc.Hex),
        'password': CryptoJS.SHA3(this.post['password'], { outputLength: 224 }).toString(CryptoJS.enc.Hex),
        'phone_number': this.post['phoneNum'] == null ? '' : this.post['phoneNum'],
        'GPA': parseInt(this.post['gpa'] == null ? 0 : this.post['gpa']),
        'grad_year': parseInt(this.post['gradYear']),
        'github_link': this.post['github'] == null ? '' : this.post['github'],
        'linkedin_link': this.post['linkedin'] == null ? '': this.post['linkedin'],
        'profile_picture': "",
        'request_supporter': false,
        'active_account': true,
        'description': "",
        'pronouns': this.post['pronouns'],
        'college': this.post['college'],
        'program': this.post['program'],
        'job_search': this.post['job_search'] == null ? false : this.post['job_search'] == 'YES',
        'work_auth': this.post['work_auth'] == null ? '' : this.post['work_auth'],
        'resume_ref': '',
        'transcript_ref': '',
        'is_undergrad': this.post['is_undergrad'] === 'YES'
      };
    } else { // supporter
      data = {
        'kind': this.typeOfUser,
        'first_name': this.post['first_name'],
        'last_name': this.post['last_name'],
        'preferred_name': this.post['preferredName'],
        'email': CryptoJS.SHA3(email, { outputLength: 224 }).toString(CryptoJS.enc.Hex),
        'password': CryptoJS.SHA3(this.post['password'], { outputLength: 224 }).toString(CryptoJS.enc.Hex),
        'phone_number': this.post['phoneNum'] == null ? '' : this.post['phoneNum'],
        'current_employer': this.post['currentEmployer'] == null ? '' : this.post['currentEmployer'],
        'title': this.post['userTitle'] == null ? '' : this.post['userTitle'],
        'supporter_type': supporterTypes,
        'profile_picture': "",
        'request_supporter': true,
        'active_account': true,
        'description': "",
        'pronouns': this.post['pronouns'],
        'location': '',
        'calendar_ref': 'gmail',
        'calendar_sync': true,
        'calendar_sync_freq': 3
      };
    }
    console.log(data);

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account',
      data).subscribe(res => {
        console.log(res);
        this.dialog.open(DialogContentExampleDialog);
    }, error => {
      console.log(error);
      if (error['error'] === 'Email Exists!') {
        this.dialog.open(EmailExistsDialog);
      } else {
        this.dialog.open(UhOhDialog);
      }
    });
  }

}

// Success dialog component
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content.html',
})
export class DialogContentExampleDialog {}

// Email exists error dialog component
@Component( {
  selector: 'email-exists-dialog',
  templateUrl: 'email-exists-dialog.html',
})
export class EmailExistsDialog {}

// Something went wrong dialog component
@Component( {
  selector: 'uh-oh-dialog',
  templateUrl: 'uh-oh-dialog.html',
})
export class UhOhDialog {}
