import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot, ActivatedRoute
} from '@angular/router';

import { AuthService } from './auth/auth.service';
import {AppRoutingModule} from './app-routing.module';

@Injectable()
export class CanActivateRouteGuard implements CanActivate {

  constructor(private auth: AuthService, private router: AppRoutingModule) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isUserAuthenticated()) {
      // this.router.navigate('\login');
      return false;
    } else {
      return true;
    }
  }
}
