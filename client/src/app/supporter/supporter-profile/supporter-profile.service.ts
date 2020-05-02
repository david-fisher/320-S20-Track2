import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class SupporterProfileService {
  supporterProfileUrl = 'https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/';

  getSupporterProfile(profileID) {
    return this.http.get(this.supporterProfileUrl + profileID);
  }

  patchSupporterProfile(changes) {
    return this.http.patch(this.supporterProfileUrl, changes);
  }

  constructor(private http: HttpClient, private cookieService: CookieService) { }
}
