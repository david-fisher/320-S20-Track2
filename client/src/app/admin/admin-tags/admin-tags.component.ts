import { Component, OnInit } from '@angular/core';
import {InterestTags} from './interest-tag';
import {TAGS} from './tag-list';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {stringify} from 'querystring';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.css']
})
export class AdminTagsComponent implements OnInit {
  tagInput;
  selectedTags;
  pageTags;
  pageSupporterTypes;
  pageAppointmentTypes;
  showTags;
  showAppointmentTypes;
  showSupporterTypes;

  constructor(private http: HttpClient) {
    this.pageTags = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags');
    this.pageSupporterTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter');
    this.pageAppointmentTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type');
    this.showTags = true;
    this.showAppointmentTypes = false;
    this.showSupporterTypes = false;
  }

  content_https(url) {
    const result = [];
    this.http.get(url, {}).subscribe(res => {
      console.log(Object.values(res));
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    console.log(result);
    return result;
  }

  push_tag() {
    console.log('Is this thing on?');
    for (const entry of this.pageTags) {
      if (entry.name === this.tagInput) {
        alert('This tag already exists, please input another..');
        return;
      }
    }
    if (confirm('Is this the tag you want? Tag: ' + this.tagInput)) {
      this.http.post<InterestTags>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags',
        {tag_name: this.tagInput}).subscribe(tag => this.pageTags.push(tag));
      }
    setTimeout(() => this.pageTags = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags'), 1700);
    }

  push_supporter_type() {
    console.log('Is this thing STILL on?');
    for (const entry of this.pageSupporterTypes) {
      if (entry.name === this.tagInput) {
        alert('This tag already exists, please input another..');
        return;
      }
    }
    if (confirm('Is this the supporter type you want? Tag: ' + this.tagInput)) {
      this.http.post<InterestTags>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter',
        {new_option: this.tagInput}).subscribe(type => this.pageSupporterTypes.push(type));
    }
    // tslint:disable-next-line:max-line-length
    setTimeout(() => this.pageSupporterTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter'), 1700);
  }

  push_appointment_type() {
    console.log('Is this thing REALLY still on?');
    for (const entry of this.pageAppointmentTypes) {
      if (entry.name === this.tagInput) {
        alert('This tag already exists, please input another..');
        return;
      }
    }
    if (confirm('Is this the appointment type you want? Tag: ' + this.tagInput)) {
      this.http.post<InterestTags>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type',
        {new_option: this.tagInput}).subscribe(type => this.pageAppointmentTypes.push(type));
    }
    // tslint:disable-next-line:max-line-length
    setTimeout(() => this.pageAppointmentTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type'), 1700);
  }

  delete_tag_https() {
    let deleteId = 0;
    if (this.selectedTags.length === 0) {
      alert('No tags selected.');
      return;
    }
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      for (const tag of Object.values(res)) {
        for (const deleteName of this.selectedTags) {
          if (tag[1] === deleteName) {
            deleteId = tag[0];
            const url = 'https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags/' + deleteId.toString();
            console.log(url);
            this.http.delete(url).subscribe();
          }
        }
      }
      setTimeout(() => this.pageTags = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags'), 1700);
    });
  }

  delete_appointment_type() {
    let deleteId = 0;
    if (this.selectedTags.length === 0) {
      alert('No appointment types selected.');
      return;
    }
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type', {}).subscribe(res => {
      for (const type of Object.values(res)) {
        for (const deleteName of this.selectedTags) {
          if (type[1] === deleteName) {
            deleteId = type[0];
            // tslint:disable-next-line:max-line-length
            const url = 'https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type/' + deleteId.toString();
            console.log(url);
            this.http.delete(url).subscribe();
          }
        }
      }
      setTimeout(() => this.pageAppointmentTypes =
        this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type'), 1700);
    });
  }

  display_tags() {
    this.showTags = true;
    this.showAppointmentTypes = false;
    this.showSupporterTypes = false;
  }

  display_appoinment_types() {
    this.showTags = false;
    this.showAppointmentTypes = true;
    this.showSupporterTypes = false;
  }

  display_supporter_types() {
    this.showTags = false;
    this.showAppointmentTypes = false;
    this.showSupporterTypes = true;
  }


  ngOnInit(): void {
  }

}
