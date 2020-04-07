import { Component, OnInit } from '@angular/core';
import {InterestTags} from './interest-tag';
import {TAGS} from './tag-list';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.css']
})
export class AdminTagsComponent implements OnInit {
  tagInput;
  get tag_list(): Array<InterestTags> {
    return TAGS;
  }

  push_tag(): Array<InterestTags> {
    if (this.tagInput.length > 0) {
      TAGS.push({name: this.tagInput});
      return TAGS;
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
