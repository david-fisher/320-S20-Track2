import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators, ValidatorFn} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {requireCheckboxesToBeCheckedValidator} from './require-checkboxes-to-be-checked.validator';
import * as CryptoJS from 'crypto-js';
import {Observable} from "rxjs";
import {InterestTags} from "../admin/admin-tags/interest-tag";

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})

export class CreateaccountComponent implements OnInit {
  userType;
  typeOfUser;
  hide = true;
  encryptSecretKey = 'SUPER_SECRET';
  formSupporterGroup: FormGroup;
  formStudentGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.userType = this.activatedRoute.snapshot.params.type === 'student';
    this.typeOfUser = this.activatedRoute.snapshot.params.type;
  }

  ngOnInit() {
    this.createSupporterForm();
    this.createStudentForm();
  }

  createSupporterForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formSupporterGroup = this.formBuilder.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'preferredName': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkPassword]],
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
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formStudentGroup = this.formBuilder.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'preferredName': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null, [Validators.required, this.checkPassword]],
      'phoneNum': [null],
      'gpa': [null],
      'gradYear': [null],
      'is_undergrad': [null, Validators.required],
      'github': [null],
      'linkedin': [null]
    });
  }

  get first_name() {
    return (this.userType ? this.formStudentGroup.get('first_name') as FormControl : this.formSupporterGroup.get('first_name') as FormControl)
  }

  get last_name() {
    return (this.userType ? this.formStudentGroup.get('last_name') as FormControl : this.formSupporterGroup.get('last_name') as FormControl)
  }

  get preferred_name() {
    return (this.userType ? this.formStudentGroup.get('preferredName') as FormControl : this.formSupporterGroup.get('preferredName') as FormControl)
  }

  onUploadClicked(data: any) {
    console.log(data);
  }


  checkPassword(control) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorEmail() {
    if (this.userType) {
      return this.formStudentGroup.get('email').hasError('required') ? 'Field is required' :
        this.formStudentGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' : '';
    } else {
      return this.formSupporterGroup.get('email').hasError('required') ? 'Field is required' :
        this.formSupporterGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' : '';
    }

  }

  getErrorPassword() {
    if (this.userType) {
      return this.formStudentGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
        this.formStudentGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
    } else {
      return this.formSupporterGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
        this.formSupporterGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
    }
  }

  onSubmit(post) {
    this.post = post;
    this.sendData();
  }

  sendData() {
    let supporterTypes;
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
    let email_split = this.post['email'].split('@');
    let email = email_split[0] + '@' + email_split[1].toLowerCase();
    let data = {
      'kind': this.typeOfUser,
      'first_name': this.post['first_name'],
      'last_name': this.post['last_name'],
      'preferred_name': this.post['preferredName'],
      'email': CryptoJS.SHA3(email).toString(CryptoJS.enc.Hex),
      'password': CryptoJS.SHA3(this.post['password']).toString(CryptoJS.enc.Hex),
      'phone_number': this.post['phoneNum'],
      'current_employer': this.post['currentEmployer'],
      'title': this.post['userTitle'],
      'GPA': this.post['gpa'],
      'grad_year': this.post['gradYear'],
      'github_link': this.post['github'],
      'linkedin_link': this.post['linkedin'],
      'supporter_type': supporterTypes,
      'profile_picture': "",
      'request_supporter': !this.userType,
      'active_account': true,
      'resume_ref': '',
      'transcript_ref': '',
      'is_undergrad': this.post['is_undergrad'] === 'Yes',
      'location': '',
      'calendar_ref': this.post['calendar_ref'],
      'calendar_sync': true,
      'calendar_sync_freq': this.post['calendar_sync_freq']
    };
    console.log(data);

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account',
      data).subscribe(res => {
        console.log(Object.values(res));
      });


  }

}
