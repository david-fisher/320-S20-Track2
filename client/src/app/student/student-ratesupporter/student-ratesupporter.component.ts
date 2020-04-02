import { Component, OnInit } from '@angular/core';
import {QUESTIONS} from './mock-questions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-ratesupporter',
  templateUrl: './student-ratesupporter.component.html',
  styleUrls: ['./student-ratesupporter.component.css']
})
export class StudentRatesupporterComponent implements OnInit {
  currentRate = 5;
  supporterName;
  constructor(private activatedRoute: ActivatedRoute) {
    this.supporterName = this.activatedRoute.snapshot.params.name;
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

}
