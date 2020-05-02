import { Component, OnInit } from '@angular/core';
import {account} from '../../login/account';
import {HttpClient} from '@angular/common/http';
import {SupporterAppointment} from '../supporter-appointments/appointments';
@Component({
  selector: 'app-supporter-availability',
  templateUrl: './supporter-availability.component.html',
  styleUrls: ['./supporter-availability.component.css']
})

export class SupporterAvailabilityComponent implements OnInit {
  body;
  list: Array<string>;
  field: string;
  date: string;
  start: string;
  end: string;
  start24: string;
  end24: string;
  startAMPM: string;
  endAMPM: string;
  dates: Array<any>;
  constructor(private http: HttpClient) {
    this.dates = [];
    this.list = [];
    this.field = "";
    this.body = {};
    this.body.user_id = account.user_id = "1";
    this.updateAvailibility();
  }
  updateAvailibility(): void
  {
    this.dates = [];
    let i = 0;
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + account.user_id,{}).subscribe(res => {
      console.log(res);
      for (const date of Object.values(res)) {
        if(i > 1) {
          console.log(date);
          let dateObj = {year:date[3].split("-")[0],month: date[3].split("-")[1], date:date[3].split("-")[2], start_hour: date[1].split(":")[0], start_min:date[1].split(":")[1], end_hour:date[2].split(":")[0],end_min:date[2].split(":")[1]};
          let a = "AM";
          if(dateObj.start_hour >= 12) {
            a = "PM";
            if (dateObj.start_hour != 12) {
              dateObj.start_hour -= 12;
            }
          }
          else if(dateObj.start_hour === 0)
          {
            dateObj.start_hour = 12;
          }
          let b = "AM";
          if(dateObj.end_hour >= 12)
          {
            b = "PM";
            if(dateObj.end_hour != 12) {
              dateObj.end_hour -= 12;
            }
          }
          else if(dateObj.end_hour === 0)
          {
            dateObj.end_hour = 12;
          }
          let s = dateObj.month + "/" + dateObj.date +"/"+dateObj.year+ ": "+dateObj.start_hour + ":" + dateObj.start_min + " " + a + " - " + dateObj.end_hour + ":" + dateObj.end_min + " "+b;
          console.log(s);
          this.dates.push({str:s});
        }
        i++;
      }
      console.log(this.field);
    });
  }
  add(): void {
    //add new avail
    if(this.timeValid()) {
      this.body = {user_id: this.body.user_id, availability_add:[{start_time: this.start24, end_time: this.end24, appt_date: this.date}]};
      console.log(this.body);
      this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.body.user_id,this.body).subscribe(res => {
        console.log(res);
      });
      this.body = {user_id: account.user_id};
      this.updateAvailibility();
    }
  }
  remove(): void {
    //remove avail
    if(this.timeValid()) {
      this.body = {user_id: this.body.user_id, availability_delete:[{start_time: this.start24, end_time: this.end24, appt_date: this.date}]};
      console.log(this.body);
      this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.body.user_id,this.body).subscribe(res => {
        console.log(res);
      });
      this.body = {user_id: account.user_id};
      this.updateAvailibility();
    }
  }
  private timeValid(): boolean {
    if (this.date !== undefined && this.start !== undefined && this.end !== undefined && this.startAMPM !== undefined && this.endAMPM !== undefined) {
      if (!this.start.includes(".") && !this.end.includes(".")&&this.start.includes(":")&&this.end.includes(":")) {
        let startarr = this.start.split(":");
        let endarr = this.end.split(":");
        let sh = Number(startarr[0]);
        let sm = Number(startarr[1]);
        let eh = Number(endarr[0]);
        let em = Number(endarr[1]);
        if(isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em))
        {
          return false;
        }
        if(!((sh > 0) && (sh <= 12) && (eh > 0) && (eh <= 12)) && !((sm > 0) && (sm <= 59) && (em >= 0) && (em <= 59)))
        {
          return false;
        }

        if (this.startAMPM === 'PM') {
          if(sh !== 12) {
            sh += 12;
          }
        }
        else
        {
          if(sh === 12)
          {
            sh = 0;
          }
        }
        if (this.endAMPM === 'PM') {
          if(eh !== 12) {
            eh += 12;
          }
        }
        else
        {
          if(eh === 12)
          {
            eh = 0;
          }
        }
        this.start24 = sh.toString() + ":" + sm.toString()+":00";
        this.end24 = eh.toString() + ":" + em.toString()+":00";
        return ((eh*60)+em) > ((sh*60)+sm);
      }
    }
    return false;
  }
  ngOnInit(): void {
  }

}
