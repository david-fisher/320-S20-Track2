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
  deleteList;

  constructor(private http: HttpClient) {
    this.pageTags = this.tags_https;
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
    });
  }

  ngOnInit(): void {
  }

}
