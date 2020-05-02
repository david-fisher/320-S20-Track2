import {Component, Inject, OnInit} from '@angular/core';
import {InterestTags} from './interest-tag';
import {TAGS} from './tag-list';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {stringify} from 'querystring';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

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
  dialogResult;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.pageTags = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags');
    this.pageSupporterTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter');
    this.pageAppointmentTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type');
    this.showTags = true;
    this.showAppointmentTypes = false;
    this.showSupporterTypes = false;
    this.dialogResult = null;
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '400px',
      height: '200px'
    });

    const promise = new Promise(resolve => {
        dialogRef.afterClosed().subscribe(response => {
          this.dialogResult = response;
          console.log(this.dialogResult);
          resolve();
        });
    });
    return promise;
  }

  openAlert() {
    const alertRef = this.dialog.open(AlertDialogueComponent, {
      width: '400px',
      height: '200px'
    });

    alertRef.afterClosed().subscribe(response => {});
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
    for (const entry of this.pageTags) {
      if (entry.name === this.tagInput) {
        this.openAlert();
        return;
      }
    }
    this.openDialog().then(() => {
      const tagPromise = new Promise (resolve => {
        if (this.dialogResult) {
          this.http.post<InterestTags>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags',
            {tag_name: this.tagInput}).subscribe();
          this.dialogResult = false;
          resolve();
        }
      }).then(() => {
        this.pageTags =
          this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags');
      });
    });
  }

  push_supporter_type() {
    for (const entry of this.pageSupporterTypes) {
      if (entry.name === this.tagInput) {
        this.openAlert();
        return;
      }
    }
    this.openDialog().then(() => {
      const supporterPromise = new Promise (resolve => {
        if (this.dialogResult) {
          this.http.post<InterestTags>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter',
            {new_option: this.tagInput}).subscribe();
          this.dialogResult = false;
          resolve();
        }
      }).then(() => {
        this.pageSupporterTypes =
          this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter');
      });
    });
  }

  push_appointment_type() {
    for (const entry of this.pageAppointmentTypes) {
      if (entry.name === this.tagInput) {
        this.openAlert();
        return;
      }
    }
    this.openDialog().then(() => {
      const appointmentPromise = new Promise (resolve => {
        if (this.dialogResult) {
          this.http.post<InterestTags>('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type',
            {new_option: this.tagInput}).subscribe();
          this.dialogResult = false;
          resolve();
        }
      }).then(() => {
        this.pageAppointmentTypes =
          this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type');
      });
    });
  }

  delete_tag_https() {
    let deleteId = 0;
    if (this.selectedTags.length === 0) {
      this.openAlert();
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
      this.openAlert();
      return;
    }
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type', {}).subscribe(res => {
      for (const type of Object.values(res)) {
        for (const deleteName of this.selectedTags) {
          if (type[1] === deleteName) {
            deleteId = type[0];
            // tslint:disable-next-line:max-line-length
            const url = 'https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options/' + deleteId.toString() + '?resource=appointment_type';
            console.log(url);
            this.http.delete(url).subscribe();
          }
        }
      }
      setTimeout(() => this.pageAppointmentTypes =
        this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type'), 1700);
    });
  }

  delete_supporter_type() {
    let deleteId = 0;
    if (this.selectedTags.length === 0) {
      this.openAlert();
      return;
    }
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter', {}).subscribe(res => {
      for (const type of Object.values(res)) {
        for (const deleteName of this.selectedTags) {
          if (type[1] === deleteName) {
            deleteId = type[0];
            // tslint:disable-next-line:max-line-length
            const url = 'https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options/' + deleteId.toString() + '?resource=type_of_supporter';
            console.log(url);
            this.http.delete(url).subscribe();
          }
        }
      }
      setTimeout(() => this.pageSupporterTypes =
        this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=type_of_supporter'), 1700);
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

// This is all dialogue stuff.

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: 'dialog-confirmation.html',
})
export class ConfirmationDialogueComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogueComponent>) {}

  onNoClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-alert',
  templateUrl: 'dialog-alert.html',
})
export class AlertDialogueComponent {

  constructor(
    public alertRef: MatDialogRef<AlertDialogueComponent>) {}

  onClick() {
    this.alertRef.close();
  }
}
