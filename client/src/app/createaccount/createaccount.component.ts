import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})
export class CreateaccountComponent implements OnInit {
  userType;
  constructor(private activatedRoute: ActivatedRoute) {
    this.userType = this.activatedRoute.snapshot.params.name === 'student';
  }

  ngOnInit(): void {
  }


}
