import { Component, OnInit } from '@angular/core';
import {QUESTIONS} from './mock-questions';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormControl, FormGroup, Validators, ValidatorFn} from '@angular/forms';
import {requireCheckboxesToBeCheckedValidator} from '../../createaccount/require-checkboxes-to-be-checked.validator';
import {UhOhDialog} from "../../createaccount/createaccount.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-student-ratesupporter',
  templateUrl: './student-ratesupporter.component.html',
  styleUrls: ['./student-ratesupporter.component.css']
})
export class StudentRatesupporterComponent implements OnInit {
  currentRate = 5;
  specs = {
    'rating': null,
    'recommend': null,
    'questions': []
  };
  supporterName;
  formStarGroup: FormGroup;
  formRecommendGroup: FormGroup;
  formQuestionGroup: FormGroup;
  questionOutput;
  apptId;


  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient, private cookieService: CookieService) {
    this.supporterName = this.activatedRoute.snapshot.params.name;
    this.apptId = this.activatedRoute.snapshot.params.appt_id;


  }

  createStarForm() {
    this.formStarGroup = this.formBuilder.group({
      stars: new FormControl('')
    });
  }

  createRecommendForm() {
    this.formRecommendGroup = this.formBuilder.group({
      recommend: new FormControl('')
    });
  }
  get questions(): Array<string> {
    let qs = [];
    this.specs['questions'].forEach(function (question) {
      qs.push(question['question']);
    });
    return qs;
  }

  createQuestionForm() {
    let form = {};
    this.questions.forEach(function (question) {
      form[question] = [null, Validators.required]
    });
    this.formQuestionGroup = this.formBuilder.group(form);
  }

  ngOnInit() {
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/data/' + this.apptId, {}).subscribe(res => {
      console.log(Object.values(res));
      this.specs['rating'] = res[1]['rating'];
      this.specs['recommend'] = res[1]['recommended'];
      this.specs['questions'] = res[0];
      this.createStarForm();
      this.createRecommendForm();
      this.createQuestionForm();
    });
  }

  toggleStar() {
    return this.specs['rating'];
  }
  toggleQuestions() {
    return this.specs['questions'].length > 0;
  }
  toggleBinaryResponse() {
    return this.specs['recommend'];
  }
  checkValidity() {
    if (this.specs['rating'] && this.formStarGroup.value.stars === '') {
      this.dialog.open(MissingStarRatingDialog);
      return false;
    }
    if (this.specs['recommend'] && this.formRecommendGroup.value.recommend === '') {
      this.dialog.open(MissingRecommendDialog);
      return false;
    }
    return true;
  }

  sendRate() {
    console.log(this.specs);
    if (!this.checkValidity()) {
      return;
    }
    let questions_output = [];
    let i = 0;
    for (const key in this.formQuestionGroup.value) {
      if (this.formQuestionGroup.value.hasOwnProperty(key)) {
        let question = {};
        question['question_id'] = this.specs['questions'][i]['question_id'];
        if (this.formQuestionGroup.value[key] === null) {
          this.dialog.open(MissingQuestionDialog);
          return;
        }
        question['response'] = this.formQuestionGroup.value[key];
        questions_output.push(question);
        i++;
      }
    }
    const data = {
      appointment_id: parseInt(this.apptId),
      user_id_: parseInt(this.cookieService.get('user_id')),
      rating: !this.specs['rating'] ? "" : this.formStarGroup.value.stars ,
      recommended: !this.specs['recommend'] ? "" : (this.formRecommendGroup.value.recommend === "r").toString(),
      questions : questions_output
    };
    console.log(data);

    this.http.post<JSON>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate',
      data).subscribe(res => {
      console.log(Object.values(res));
      this.dialog.open(FeedbackSuccessDialog);
    }, error => {
        this.dialog.open(UhOhDialog);
    });
  }

}

// Missing star component
@Component({
  selector: 'missing-star-rating-dialog',
  templateUrl: 'missing-star-rating.html',
})
export class MissingStarRatingDialog {}

// Missing star component
@Component({
  selector: 'missing-recommend-dialog',
  templateUrl: 'missing-recommend.html',
})
export class MissingRecommendDialog {}

// Missing question component
@Component({
  selector: 'missing-question-dialog',
  templateUrl: 'missing-question.html',
})
export class MissingQuestionDialog {}

// Success component
@Component({
  selector: 'feedback-success-dialog',
  templateUrl: 'feedback-success.html',
})
export class FeedbackSuccessDialog {}
