import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SupporterAppointment, SupporterFeedback} from '../supporter-appointments/appointments';
import {HttpClient} from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";
import {SupporterSettings} from "./settings";
//import {account} from "../../login/account";

@Component({
  selector: 'app-supporter-settings',
  templateUrl: './supporter-settings.component.html',
  styleUrls: ['./supporter-settings.component.css']
})
export class SupporterSettingsComponent implements OnInit {

  declare tempSettings: SupporterSettings;
  job_title;
  first_name;
  last_name;
  pref_name;
  phone_number;
  employer;
  bio;
  pronouns;
  question;
  question_id;
  publicFeedback;
  recommend;
  stars;
  location;
  test_job_title = "testing";

  body;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.body = {};
    //this.body.user_id = this.cookieService.get('user_id');
    //console.log(this.body);
    this.tempSettings = this.currSettings;
    console.log(this.tempSettings);
  }


  get currSettings(): SupporterSettings {
    const helpme : SupporterSettings = {
      job_title: "",
      first_name:"",
      last_name:"",
      pref_name: "",
      phone_number: 0,
      employer: "",
      location: "",
      bio: "",
      pronouns: "",
      question: "",
      question_id: 0,
      publicFeedback: false,
      recommend: false,
      stars: false};
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.cookieService.get('user_id'), {}).subscribe(res => {
      console.log(res[1][1]);

        helpme.job_title = res[1][1];
        helpme.first_name= res[0][3];
        helpme.last_name= res[0][4];
        helpme.pref_name= res[0][5];
        helpme.phone_number= res[0][6];
        helpme.employer= res[1][2];
        helpme.location= res[1][3];
        helpme.bio= res[0][10];
        helpme.pronouns= res[0][11];
        helpme.question= "What could I improve upon?";
        helpme.question_id= 1000;
        helpme.publicFeedback= false;
        helpme.recommend= false;
        helpme.stars= false;
        //return tempSets;
    });
    return helpme;
  }

  click(): void{
    console.log(this.bio);
    console.log(this.job_title);
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
    if(this.location !== undefined)
    {
      this.body.location = this.location;
    }
    if(this.question !== undefined)
    {
      this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/' + this.cookieService.get('user_id'), {}).subscribe(res => {
        console.log(res);
        this.body.question_id = res[4];
      });
      this.body.question = this.question;
    }
    if(this.publicFeedback !== undefined)
    {
      this.body.show_feedback = this.publicFeedback;
    }
    if(this.stars !== undefined)
    {
      this.body.rating = this.stars;
    }
    if(this.pronouns !== undefined)
    {
      this.body.pronouns = this.pronouns;
    }
    if(this.bio !== undefined)
    {
      this.body.description = this.bio;
    }
    if(this.recommend !== undefined)
    {
      this.body.ask_recommended = this.recommend;
    }
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.cookieService.get('user_id'), this.body).subscribe(res => {
      console.log(this.body);
    });
  }

  ngOnInit(): void {
  }



}
