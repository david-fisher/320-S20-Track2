import { Component, OnInit } from '@angular/core';
import {InterestTags} from './interest-tag';
import {TAGS} from './tag-list';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.css']
})
export class AdminTagsComponent implements OnInit {
  tagInput;
  selectedTags;

  constructor(private http: HttpClient) {
  }

  get tag_list(): Array<InterestTags> {
    return TAGS;
  }

  get tags_https(): Array<InterestTags> { // Function which you can call to make a request
    const input = this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags')
    const response = Object.keys(input);
    let result = [];
    for (const tag of response) {
      result.push(tag);
    }
    return result;
  }

  push_tag(): Array<InterestTags> {
    if (this.tagInput.length > 0) {
      for (const entry of TAGS) {
        if (entry.name === this.tagInput) {
          alert('This tag already exists, please input another..');
          return TAGS;
        }
      }
      if (confirm('Is this the tag you want? Tag: ' + this.tagInput)) {
        TAGS.push({name: this.tagInput});
      }
    }
    return TAGS;
  }

  delete_tag(): Array<InterestTags> {
    const array = [];
    for (const entry of this.selectedTags) {
      array.push(entry);
   }
    if (confirm('Are these the tags you wish to delete? Tags: ' + array)) {
      for (let i = 0; i < array.length; i++) {
        let index = -1;
        for (let j = 0; j < TAGS.length; j++) {
          if (TAGS[j].name === array[i]) {
            index = j;
          }
        }
        if (index > -1) {
          TAGS.splice(index, 1);
        }
      }
    }
    return TAGS;
  }

  ngOnInit(): void {
  }

}
