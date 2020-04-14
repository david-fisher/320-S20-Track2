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
  selectedTags;
  get tag_list(): Array<InterestTags> {
    return TAGS;
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
  constructor() { }

  ngOnInit(): void {
  }

}
