import { Component, OnInit } from '@angular/core';
import {SUPPORTERS} from '../student-makeappointment/mock-supporters';
import {Supports} from '../student-makeappointment/supports';
import {TAGS} from '../student-makeappointment/mock-tags';
//import {Tags} from './tags';
import {Tags} from '../student-makeappointment/tags';
import {InterestTags} from "../../admin/admin-tags/interest-tag";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-findsupporters',
  templateUrl: './student-findsupporters.component.html',
  styleUrls: ['./student-findsupporters.component.css']
})
export class StudentFindsupportersComponent implements OnInit {
  selectedTags;
  pageTags;

  constructor(private http: HttpClient) {
    this.pageTags = this.tags_https;
  }
  get supporters(): Supports[] {

    let list: Array<any> = [];
    if (this.selectedTags == null) {
      return SUPPORTERS;
    }

    if (this.selectedTags.length === 0) {
      return SUPPORTERS;
    }

    // tslint:disable-next-line:forin
    for (const x in SUPPORTERS) {
      // tslint:disable-next-line:prefer-for-of
      let count: number = 0;
      for (let i = 0; i <  this.selectedTags.length; i++ ) {
          if (SUPPORTERS[x].tags.includes(this.selectedTags[i])) {
            count++;
          }
      }
      if(count === this.selectedTags.length){
        list.push(SUPPORTERS[x]);
      }
    }
    return list;
  }

  get tags(): Tags {
    return TAGS;
  }

  get tags_https(): Array<InterestTags> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      console.log(Object.values(res));
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    console.log(result);
    return result;
  }

  ngOnInit(): void {
  }

  save(): void {
  }

}
