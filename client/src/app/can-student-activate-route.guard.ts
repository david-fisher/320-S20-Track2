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
export class CanStudentActivateRouteGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
    this.router = router;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isUserStudent()) {
      this.router.navigateByUrl('\login').then(() => console.log('Done'));
      return false;
    } else {
      return true;
    }
  }
}
