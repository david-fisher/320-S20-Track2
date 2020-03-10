import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule } from '@angular/router';
import {TestComponent} from './test/test.component';
import {LoginComponent} from './login/login.component';
import {FaqComponent} from './faq/faq.component';
import {CanActivateRouteGuard} from './can-activate-route.guard';
import {FindsupportersComponent} from './findsupporters/findsupporters.component';
import {ProfileComponent} from './profile/profile.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: TestComponent },
  { path: 'login', component: LoginComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'findsupporters', component: FindsupportersComponent, canActivate: [ CanActivateRouteGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [ CanActivateRouteGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

