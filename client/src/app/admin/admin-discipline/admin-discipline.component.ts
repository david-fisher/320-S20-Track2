import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-admin-discipline',
  templateUrl: './admin-discipline.component.html',
  styleUrls: ['./admin-discipline.component.css']
})
export class AdminDisciplineComponent implements OnInit {
  reportedID;
  dialogResult;
  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient) {
    this.reportedID = this.activatedRoute.snapshot.params.filedAgainstID;
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(BanConfirmationDialogueComponent, {
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

  ban() {
    console.log(this.reportedID.length);
    if (this.reportedID.length > 0) {
      this.openDialog().then(() => {
        if (this.dialogResult) {
          this.http.patch('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.reportedID.toString(),
            {active_account: false}).subscribe(res => {
          });
        }
      });
    }
  }
}

// This is all dialogue stuff.

@Component({
  selector: 'app-ban-dialog-confirmation',
  templateUrl: 'ban-confirmation.html',
})
export class BanConfirmationDialogueComponent {

  constructor(
    public dialogRef: MatDialogRef<BanConfirmationDialogueComponent>) {}
}
