import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SupporterAppointment} from '../supporter-appointments/appointments';
import {HttpClient} from '@angular/common/http';
import {account} from "../../login/account";

@Component({
  selector: 'app-supporter-settings',
  templateUrl: './supporter-settings.component.html',
  styleUrls: ['./supporter-settings.component.css']
})
export class SupporterSettingsComponent implements OnInit {
  job_title
  first_name;
  last_name;
  pref_name;
  phone_number;
  employer;
  bio;
  body;
  constructor(private http: HttpClient) {
    this.body = {};
    //this.body.user_id = account.user_id;
    this.body.user_id = 30;
    console.log(this.body);
  }
  click(): void{
    if(this.first_name !== undefined)
    {
      this.body.first_name = this.first_name;
    }
    if(this.last_name !== undefined)
    {
      this.body.last_name = this.last_name;
    }
    if(this.pref_name !== undefined)
    {
      this.body.preferred_name = this.pref_name;
    }
    if(this.phone_number !== undefined)
    {
      this.body.phone_number = this.phone_number;
    }
    if(this.employer !== undefined)
    {
      this.body.current_employer = this.employer;
    }
    if(this.job_title !== undefined)
    {
      this.body.title = this.job_title;
    }
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.body.user_id, this.body).subscribe(res => {
      console.log(res);
    });
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.body.user_id, {}).subscribe(res => {
      console.log(res);
    });
  }
  ngOnInit(): void {
  }

}
