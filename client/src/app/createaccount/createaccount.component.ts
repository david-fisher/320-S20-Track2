import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})
export class CreateaccountComponent implements OnInit {
  userType;
  form: FormGroup;
  public myGroup;

  constructor(private activatedRoute: ActivatedRoute) {
    this.userType = this.activatedRoute.snapshot.params.type === 'student';
    this.myGroup = new FormGroup({
      firstName: new FormControl()
    });
  }

  ngOnInit(): void {
  }
  sendData() {
    if (this.userType) {

    } else {

    }
  }
}
