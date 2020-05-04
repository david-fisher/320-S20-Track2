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
  myTags;
  mySelectedTags;
  pageTags;
  selectedTags;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.body = {};
    //this.body.user_id = this.cookieService.get('user_id');
    //console.log(this.body);
    this.tempSettings = this.currSettings;
    console.log(this.tempSettings);
    this.myTags = this.my_tags();
    this.pageTags = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags');
  }

  content_https(url) {
    const result = [];
    this.http.get(url, {}).subscribe(res => {
      console.log(Object.values(res));
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    console.log(result);
    return result;
  }

  my_tags() {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + + this.cookieService.get('user_id')).subscribe(res => {
      for (let i = 0; i < Object.values(res)[4].length; i++) {
        result.push({name: Object.values(res)[4][i][0]});
      }
    });
    console.log(result);
    return result;
  }

  delete_my_tags() {
    let deleteArray = [];
    if (this.mySelectedTags.length === 0) {
      return;
    }
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      for (const tag of Object.values(res)) {
        for (const deleteName of this.mySelectedTags) {
          if (tag[1] === deleteName) {
            deleteArray.push({tag_id: tag[0]});
          }
        }
      }
      const deleteBody = {tags_delete: deleteArray};
      console.log(deleteBody);
      this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/'
        + this.cookieService.get('user_id'), deleteBody).subscribe();
      setTimeout(() => this.myTags = this.my_tags(), 1700);
    });
  }

  add_my_tags() {
    let addArray = [];
    if (this.selectedTags.length === 0) {
      return;
    }
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      for (const tag of Object.values(res)) {
        for (const addName of this.selectedTags) {
          if (tag[1] === addName) {
            addArray.push({tag_id: tag[0]});
          }
        }
      }
      const addBody = {tags_add: addArray};
      this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/'
        + this.cookieService.get('user_id'), addBody).subscribe();
      setTimeout(() => this.myTags = this.my_tags(), 1700);
    });
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
      questions: [],
      question_ids: [],
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
      //return tempSets;
    });
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/data/' + this.cookieService.get('user_id'), {}).subscribe(res => {
      console.log(res[1][1]);

      helpme.questions=[];
      helpme.question_ids=[];
      helpme.publicFeedback= false;
      helpme.recommend= false;
      helpme.stars= false;
      //return tempSets;
    });
    return helpme;
  }

  click(): void{
    //console.log(this.bio);
    //console.log(this.job_title);
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
        if(res[4] !== undefined){
          this.body.question_id = res[4];
        }
        else{
          this.body.question_id = Math.random()*100000;
        }

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
