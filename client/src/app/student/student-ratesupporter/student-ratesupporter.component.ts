import { Component, OnInit } from '@angular/core';
import {QUESTIONS} from './mock-questions';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-student-ratesupporter',
  templateUrl: './student-ratesupporter.component.html',
  styleUrls: ['./student-ratesupporter.component.css']
})
export class StudentRatesupporterComponent implements OnInit {
  currentRate = 5;
  supporterName;
  questionOutput;
  appt_id;
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.supporterName = this.activatedRoute.snapshot.params.name;
    this.appt_id = this.activatedRoute.snapshot.params.appt_id;
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/' + this.appt_id, {}).subscribe(res => {
      console.log(Object.values(res));
    });
  }

  ngOnInit(): void {
  }
  get questions(): Array<string> {
    return QUESTIONS;
  }
  toggleStar() {
    return true;
  }
  toggleQuestions() {
    return true;
  }
  toggleBinaryResponse() {
    return true;
  }
  sendRate() {
    const data = {
      'appointment_id': this.appt_id,
      'user_id': this.cookieService.get('user_id'),
      'rating': 1,
      'recommend': false,
      'questions' : this.questionOutput
    };

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate',
      data).subscribe(res => {
      console.log(Object.values(res));
    });
  }

}
