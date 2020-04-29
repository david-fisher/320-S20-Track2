import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  studentProfileUrl = 'https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/account/' + this.cookieService.get('user_id');

  getStudentProfile() {
    return this.http.get(this.studentProfileUrl);
  }

  patchStudentProfile(changes) {
    return this.http.patch(this.studentProfileUrl, changes);
  }

  constructor(private http: HttpClient, private cookieService: CookieService) { }
}
