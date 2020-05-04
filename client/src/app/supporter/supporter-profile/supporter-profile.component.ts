import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatGridListModule} from '@angular/material/grid-list';
import { SupporterProfileService } from './supporter-profile.service';
import { SupporterInfo } from './supporter-info';
import { ActivatedRoute } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-supporter-profile',
  templateUrl: './supporter-profile.component.html',
  styleUrls: ['./supporter-profile.component.css']
})

/*To Implement:
Click/listening instead of multiple functions
Asynchronicity for Http requests
Editing avatar
 */
export class SupporterProfileComponent implements OnInit {
  public informationFlag = true;
  public descriptionFlag = true;
  public linksFilesFlag = true;
  public profileID = '';
  public userID = '';
  public canEdit = false;
  profileTags;

  // hard coded things need to be updated by the lambdas

public supporterInfo: SupporterInfo = {
    first_name: '',
    last_name: '',
    preferred_name: '',
    pronouns: 'He/Him/His',
    title: '',
    current_employer: '',
    location: '',
    phone_number: 0,
    personal_description: 'I am a Trellis supporter!'
  }

  constructor(private activatedRoute: ActivatedRoute, private supporterProfileService: SupporterProfileService,
              private cookieService: CookieService, private http: HttpClient) {
    this.profileID = this.activatedRoute.snapshot.params.supp_id;
    this.userID = this.cookieService.get('user_id');
    if (this.profileID.match(this.userID)) {
      this.canEdit = true;
    }
    this.profileTags = this.profile_tags();
  }

  profile_tags() {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.profileID
      + this.cookieService.get(this.profileID)).subscribe(res => {
      for (let i = 0; i < Object.values(res)[4].length; i++) {
        result.push({name: Object.values(res)[4][i][0]});
      }
    });
    console.log(result);
    return result;
  }



  // importing supporter data
  showSupporterProfile() {
    this.supporterProfileService.getSupporterProfile(this.profileID)
      .subscribe(data => {
        console.log(Object.values(data));
        this.supporterInfo.first_name = Object.values(data)[0][3];
        this.supporterInfo.last_name = Object.values(data)[0][4];
        this.supporterInfo.preferred_name = Object.values(data)[0][5];
        // pronouns
        this.supporterInfo.title = Object.values(data)[1][1];
        this.supporterInfo.current_employer = Object.values(data)[1][2];
        this.supporterInfo.location = Object.values(data)[1][3];
        this.supporterInfo.phone_number = Object.values(data)[0][6];
        this.supporterInfo.personal_description = Object.values(data)[0][10];
      });
  }



  ngOnInit(): void {
    this.showSupporterProfile();
    console.log(this.supporterInfo);
  }

  /*
  Boolean toggle flags
  Each submit sends a PATCH request for the editable fields
   */
  runInformation() {
    this.informationFlag = false;
  }
  submitInformation() {
    this.informationFlag = true;
    this.supporterProfileService.patchSupporterProfile({
      preferred_name: this.supporterInfo.preferred_name,
      last_name: this.supporterInfo.last_name,
    }).subscribe(data => {console.log(data); });
  }

  runDescription() {
    this.descriptionFlag = false;
  }
  submitDescription() {
    this.descriptionFlag = true;
  }

  runLinksFiles() {
    this.linksFilesFlag = false;
  }

}
