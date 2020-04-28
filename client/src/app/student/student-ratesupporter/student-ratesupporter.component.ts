import { Component, OnInit } from '@angular/core';
import {QUESTIONS} from './mock-questions';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormControl, FormGroup, Validators, ValidatorFn} from '@angular/forms';
import {requireCheckboxesToBeCheckedValidator} from '../../createaccount/require-checkboxes-to-be-checked.validator';

@Component({
  selector: 'app-student-ratesupporter',
  templateUrl: './student-ratesupporter.component.html',
  styleUrls: ['./student-ratesupporter.component.css']
})
export class StudentRatesupporterComponent implements OnInit {
  currentRate = 5;
  supporterName;
  formStarGroup: FormGroup;
  questionOutput;
  apptId;


  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.supporterName = this.activatedRoute.snapshot.params.name;
    this.apptId = this.activatedRoute.snapshot.params.appt_id;
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/' + this.apptId, {}).subscribe(res => {
      console.log(Object.values(res));
    });
  }

  createStarForm() {
    this.formStarGroup = this.formBuilder.group({
      stars: new FormControl('')
    });
  }

  ngOnInit() {
    this.createStarForm();
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
      appointment_id: this.apptId,
      user_id: this.cookieService.get('user_id'),
      rating: this.formStarGroup.value.stars,
      recommend: false,
      questions : this.questionOutput
    };

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate',
      data).subscribe(res => {
      console.log(Object.values(res));
    });
  }

}
