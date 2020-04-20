import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})
export class CreateaccountComponent implements OnInit {
  userType;
  typeOfUser;
  userName: string;
  preferredName: string;
  gpa: string;
  gradYear: string;
  github: string;
  linkedin: string;
  supporterType: Array<string>;
  userTitle: string;
  currentEmployer: string;
  form: FormGroup;
  public myGroup;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.userType = this.activatedRoute.snapshot.params.type === 'student';
    this.typeOfUser = this.activatedRoute.snapshot.params.type;
    this.myGroup = new FormGroup({
      firstName: new FormControl()
    });
  }

  ngOnInit(): void {
  }
  sendData() {
    const data = {
      'userType': this.typeOfUser,
      'userName': this.userName,
      'preferredName': this.preferredName,
      'gpa': this.gpa,
      'gradYear': this.gradYear,
      'github': this.github,
      'linkedin': this.linkedin,
      'supporterType': this.supporterType,
      'userTitle': this.userTitle,
      'currentEmployer': this.currentEmployer
    };
    this.http.post<JSON>("https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account", data)
  }
}
