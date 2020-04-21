import { Component, OnInit } from '@angular/core';
import {InterestTags} from './interest-tag';
import {TAGS} from './tag-list';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {stringify} from "querystring";

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.css']
})
export class AdminTagsComponent implements OnInit {
  tagInput;
  selectedTags;
  pageTags;

  constructor(private http: HttpClient) {
    this.pageTags = this.tags_https;
  }

  get tags_https(): Array<InterestTags> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      for (const tag of res) {
        const newTag = {name: tag[1]}
        result.push(newTag);
      }
    });
    console.log(result);
    return result;
  }

  push_tag() {
    if (this.tagInput.length > 0) {
      for (const entry of this.pageTags) {
        if (entry.name === this.tagInput) {
          alert('This tag already exists, please input another..');
        }
      }
      if (confirm('Is this the tag you want? Tag: ' + this.tagInput)) {
        this.http.put('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {tag_name: this.tagInput}).subscribe();
      }
    }
    this.pageTags = this.tags_https;
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
