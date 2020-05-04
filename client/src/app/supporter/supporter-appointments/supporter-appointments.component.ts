import { Component, OnInit } from '@angular/core';
import {SupporterAppointment} from './appointments';
import {SupporterFeedback} from './appointments';
//import {TEST_APPOINTMENTS} from "./appointments";
import { Router } from '@angular/router';
import {InterestTags} from "../../admin/admin-tags/interest-tag";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-supporter-appointments',
  templateUrl: './supporter-appointments.component.html',
  styleUrls: ['./supporter-appointments.component.css']
})
export class SupporterAppointmentsComponent implements OnInit {

  tempAppointments;
  //tempFeedback;
  overwrittenAvail;
  body;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.body = {};
    this.overwrittenAvail = {};
    this.tempAppointments = this.appointments;
    //this.tempFeedback = this.feedback(2, this.cookieService.get('user_id'));
    //console.log(this.tempFeedback);
  }

  get date(): object {
    return new Date();
  }

  get appointments(): Array<SupporterAppointment> {
    const result = [];


      const bigmap = [];
      const qs = [];
      const q_ids = [];
      //let sf = true;
      let show_ratin = true;
      let show_rec = true;


      this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/data/'+ this.cookieService.get('user_id'), {}).subscribe(res => {
        //console.log(Object.values(res));
        for(const qa in Object.values(res)[0]){
          qs.push(Object.values(res)[0][qa].question);
          q_ids.push(Object.values(res)[0][qa].question_id);
        }
        //sf = Object.values(res)[1].show_feedback;
        show_ratin = Object.values(res)[1].rating;
        show_rec = Object.values(res)[1].recommended;
      });

    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/'+this.cookieService.get('user_id'), {}).subscribe(res => {
        // console.log(Object.values(res));
        // console.log(Object.values(res)[0]);
        // console.log(Object.values(res)[1]);

        for(const feed in Object.values(res)[0]){
          const feed_appt_id = Object.values(res)[0][feed].appointment_id;
          if(bigmap[feed_appt_id] === undefined) {
            bigmap[feed_appt_id] = {};
          }
          bigmap[feed_appt_id].rating = Object.values(res)[0][feed].rating;
          bigmap[feed_appt_id].recommend = Object.values(res)[0][feed].recommended;
        }
        for(const respo in Object.values(res)[1]){
          const ind = q_ids.indexOf(Object.values(res)[1][respo].question_id);
          const respo_appt_id = Object.values(res)[1][respo].appointment_id;
          if(ind > -1){
            bigmap[respo_appt_id].as[ind] = Object.values(res)[1][respo].response;
          //console.log(qa);
          }
        }
      });


    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/' + this.cookieService.get('user_id'), {observe: 'response'}).subscribe(res => {
      //console.log(Object.values(res));
      if(res.status === 200 && res.body !== "") {
        for (const appt of Object.values(res)[6]) {
          const as = [];

          let rat = 0;
          let rec = true;

          if(bigmap[appt[0]] !== undefined)
          {
            rat = bigmap[appt[0]].rating;
            rec = bigmap[appt[0]].recommend;
          }
          console.log(appt[11]);
          const newAppt: SupporterAppointment = {
            date: new Date(appt[2].split("-")[0], appt[2].split("-")[1], appt[2].split("-")[2], appt[3].split(":")[0], appt[3].split(":")[1], appt[3].split(":")[2], 0),
            type: appt[9],
            student: appt[7] + " " + appt[8],
            location: appt[10],
            duration: appt[4],
            appt_id: appt[0],
            cancelled: appt[6],
            rated: appt[11],
            question: qs,
            answer: [],
            show_rating: show_ratin,
            rating: rat,
            show_recommend: show_rec,
            recommend: rec,
          };
          result.push(newAppt);
        }
      }
    });
    return result;
  }

  // feedback(appt_id): SupporterFeedback {
  //   const result : SupporterFeedback = {question: "What can I do to improve?", answer: "More cowbell.", show_rating: true, rating: 4, show_recommend: false, recommend: true};
  //   console.log(result);
  //   return result;
  // }



  // feedback(appt_id, supp_id): SupporterFeedback {
  //   //const result = {} as SupporterFeedback;
  //   const result : SupporterFeedback = {question: [], answer: [], show_rating: true, rating: 0, show_recommend: true, recommend: true};
  //   const q_ids = [];
  //
  //   this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/data/'+appt_id, {}).subscribe(res => {
  //     //console.log(Object.values(res));
  //     for(const qa in Object.values(res)[0]){
  //       result.question.push(Object.values(res)[0][qa].question);
  //       q_ids.push(Object.values(res)[0][qa].question_id);
  //       result.answer.push("");
  //       //console.log(qa);
  //     }
  //     result.show_rating = Object.values(res)[1].rating;
  //     result.show_recommend = Object.values(res)[1].recommended;
  //   });
  //
  //   this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/rate/'+supp_id, {}).subscribe(res => {
  //     console.log(Object.values(res));
  //     console.log(Object.values(res)[0]);
  //     console.log(Object.values(res)[1]);
  //     for(const feed in Object.values(res)[0]){
  //       result.rating = Object.values(res)[0][feed].rating;
  //       result.recommend = Object.values(res)[0][feed].recommended;
  //     }
  //     for(const respo in Object.values(res)[1]){
  //       const ind = q_ids.indexOf(Object.values(res)[1][respo].question_id);
  //       if(ind > -1){
  //         result.answer[ind] = Object.values(res)[1][respo].response;
  //       //console.log(qa);
  //       }
  //     }
  //   });
  //
  //   console.log(result);
  //   return result;
  // }

  verify(appointment) {
    if (confirm('Are you sure you want to cancel?')) {
      prompt('Please state a reason for cancellation.');
      for (const x in this.tempAppointments) {
        if (this.tempAppointments[x] === appointment) {
          this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments/' + appointment.appt_id, {}).subscribe(res => {
            //console.log(Object.values(res));
            //console.log(appointment.appt_id);
          });

          this.tempAppointments.splice(parseInt(x), 1);
          //console.log(x);

          const endDate = appointment.date;
          endDate.setMinutes(endDate.getMinutes() + 20);
          this.overwrittenAvail.start_time = appointment.date.format('HHMM');
          this.overwrittenAvail.end_time = (endDate).format('HHMM');
          this.overwrittenAvail.appt_date = appointment.date.format('DDMMYY');
          this.body.availability_delete = [];
          this.body.availability_delete.push(this.overwrittenAvail);

          this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.cookieService.get('user_id'), this.body).subscribe(res => {
            //console.log(Object.values(res));
            //console.log(appointment.appt_id);
          });

        }
      }
    }
  }

  ngOnInit(): void {
  }

}
