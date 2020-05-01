import { Component, OnInit } from '@angular/core';
import {account} from '../../login/account';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-supporter-availability',
  templateUrl: './supporter-availability.component.html',
  styleUrls: ['./supporter-availability.component.css']
})

export class SupporterAvailabilityComponent implements OnInit {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  body;

  date: string;
  start: string;
  end: string;
  startAMPM: string;
  endAMPM: string;
  start24: number;
  end24: number;
  constructor(private http: HttpClient) {
    let sundayList = [], mondayList = [],tuesdayList = [], wednesdayList = [],thursdayList = [], fridayList = [], saturdayList = [];
    //add all times from get request
    sundayList.push('Unavailable');
    mondayList.push('Unavailable');
    tuesdayList.push('Unavailable');
    wednesdayList.push('Unavailable');
    thursdayList.push('Unavailable');
    fridayList.push('Unavailable');
    saturdayList.push('Unavailable');
    this.sunday = sundayList.toString();
    this.monday = sundayList.toString();
    this.tuesday = sundayList.toString();
    this.wednesday = sundayList.toString();
    this.thursday = sundayList.toString();
    this.friday = sundayList.toString();
    this.saturday = sundayList.toString();

    this.body = {};
    this.body.user_id = account.user_id = "30";
  }
  add(): void {
    //add new avail
    this.body.availability_add = {start_time: this.start24 * 60, end_time: this.end24 * 60, appt_date: this.date};
    console.log(this.body);
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.body.user_id, this.body).subscribe(res => {
      console.log(res);
    });
    this.body = {};
  }
  remove(): void {
    //remove avail
    this.body.availability_delete = {start_time: this.start24 * 60, end_time: this.end24 * 60, appt_date: this.date};
    console.log(this.body);
    this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.body.user_id, this.body).subscribe(res => {
      console.log(res);
    })
    this.body = {};
  }
  private timeValid(): boolean {
    if (this.date !== undefined && this.start !== undefined && this.end !== undefined && this.startAMPM !== undefined && this.endAMPM !== undefined) {
      if (!this.start.includes(".") && !this.end.includes(".")&&!isNaN(Number(this.start)) && !isNaN(Number(this.end))) {
        let s = Number(this.start);
        let e = Number(this.end);
        if(!(s > 0) && (s <= 12) && (e > 0) && (e <= 12))
        {
          return false;
        }
        if (this.startAMPM === 'PM') {
          s += 12;
        }
        if (this.endAMPM === 'PM') {
           e += 12;
        }
        this.start24 = s;
        this.end24 = e;
        return (e > s);
      }
    }
    return false;
  }
  ngOnInit(): void {
  }

}
