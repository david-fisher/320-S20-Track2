import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators, ValidatorFn} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {requireCheckboxesToBeCheckedValidator} from './require-checkboxes-to-be-checked.validator';
import {Observable} from "rxjs";

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})

export class CreateaccountComponent implements OnInit {
  // userType;
  // typeOfUser;
  // userName: string;
  // preferredName: string;
  // gpa: string;
  // gradYear: string;
  // github: string;
  // linkedin: string;
  // phoneNum: string;
  // supporterType: Array<string>;
  // userTitle: string;
  // currentEmployer: string;
  // form: FormGroup;
  // public myGroup;
  //
  // constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) {
  //   this.userType = this.activatedRoute.snapshot.params.type === 'student';
  //   this.typeOfUser = this.activatedRoute.snapshot.params.type;
  //   this.myGroup = new FormGroup({
  //     firstName: new FormControl()
  //   });
  // }
  //
  // ngOnInit(): void {
  // }
  // sendData() {
  //   const data = {
  //     'userType': this.typeOfUser,
  //     'userName': this.userName,
  //     'preferredName': this.preferredName,
  //     'gpa': this.gpa,
  //     'gradYear': this.gradYear,
  //     'github': this.github,
  //     'linkedin': this.linkedin,
  //     'supporterType': this.supporterType,
  //     'userTitle': this.userTitle,
  //     'currentEmployer': this.currentEmployer
  //   };
  //   this.http.post<JSON>("https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account", data)
  // }
  userType;
  typeOfUser;
  formSupporterGroup: FormGroup;
  formStudentGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.userType = this.activatedRoute.snapshot.params.type === 'student';
    this.typeOfUser = this.activatedRoute.snapshot.params.type;
  }

  ngOnInit() {
    this.createSupporterForm();
    this.createStudentForm();
    // this.setChangeValidate()
  }

  createSupporterForm() {
    // let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formSupporterGroup = this.formBuilder.group({
      // 'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'preferredName': [null, Validators.required],
      'phoneNum': [null],
      'currentEmployer': [null],
      'userTitle': [null],
      supporterTypes: new FormGroup ({
        'Alumni': new FormControl(false),
        'Industry Affiliate': new FormControl(false),
        'Professor': new FormControl(false),
      }, requireCheckboxesToBeCheckedValidator(this.userType)),
      // 'password': [null, [Validators.required, this.checkPassword]],
      // 'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      // 'validate': ''
    });
  }

  createStudentForm() {
    // let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formStudentGroup = this.formBuilder.group({
      // 'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'preferredName': [null, Validators.required],
      'phoneNum': [null],
      'gpa': [null],
      'gradYear': [null],
      'github': [null],
      'linkedin': [null]
    });
  }


  // setChangeValidate() {
  //   this.formGroup.get('validate').valueChanges.subscribe(
  //     (validate) => {
  //       if (validate == '1') {
  //         this.formGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
  //         this.titleAlert = "You need to specify at least 3 characters";
  //       } else {
  //         this.formGroup.get('name').setValidators(Validators.required);
  //       }
  //       this.formGroup.get('name').updateValueAndValidity();
  //     }
  //   )
  // }

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

  // checkPassword(control) {
  //   let enteredPassword = control.value
  //   let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  //   return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  // }
  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }
  //
  // checkInUseEmail(control) {
  //   // mimic http database access
  //   let db = ['tony@gmail.com'];
  //   return new Observable(observer => {
  //     setTimeout(() => {
  //       let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
  //       observer.next(result);
  //       observer.complete();
  //     }, 4000)
  //   })
  // }

  // getErrorEmail() {
  //   return this.formGroup.get('email').hasError('required') ? 'Field is required' :
  //     this.formGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
  //       this.formGroup.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  // }

  // getErrorPassword() {
  //   return this.formGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
  //     this.formGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  // }

  onSubmit(post) {
    this.post = post;
  }

  sendData() {
    let supporterTypes;
    if (!this.userType) {
      supporterTypes = [];
      for (const key in this.post) {
        if (this.post.hasOwnProperty(key)) {
          if (this.post[key]) {
            supporterTypes.append(key);
          }
        }
      }
    }
    let data = {
      'first_name': this.post['first_name'],
      'last_name': this.post['last_name'],
      'preferred_name': this.post['preferredName'],
      'phone_number': this.post['phoneNum'],
      'current_employer': this.post['currentEmployer'],
      'title': this.post['userTitle'],
      'GPA': this.post['gpa'],
      'grad_year': this.post['gradYear'],
      'github_link': this.post['github'],
      'linkedin_link': this.post['linkedin'],
      'supporter_type': supporterTypes
    };



    this.http.post<JSON>("https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account", data)
  }

}
