import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  isUserAuthenticated() {
    return this.cookieService.check('logged-in');
  }

  isUserStudent() {
    /*
    Returns if the user is a student by checking the user_type cookie
     */
    return this.cookieService.get('user_type') === 'student';
  }

  isUserSupporter() {
    /*
    Returns if the user is a supporter by checking the user_type cookie
     */
    return this.cookieService.get('user_type') === 'supporter';
  }

}
