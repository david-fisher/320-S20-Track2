import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {FaqComponent} from './faq/faq.component';
import {CanActivateRouteGuard} from './can-activate-route.guard';
import {FindsupportersComponent} from './student/findsupporters/findsupporters.component';
import {ProfileComponent} from './student/profile/profile.component';
import {SupporterLandingComponent} from './supporter/supporter-landing/supporter-landing.component';
import {SupporterAppointmentsComponent} from './supporter/supporter-appointments/supporter-appointments.component';
import {SupporterSettingsComponent} from './supporter/supporter-settings/supporter-settings.component';
import {SupporterAvailabilityComponent} from './supporter/supporter-availability/supporter-availability.component';
import {AdminReportsComponent} from './admin/admin-reports/admin-reports.component';
import {AdminApplicationsComponent} from './admin/admin-applications/admin-applications.component';
import {AdminTagsComponent} from './admin/admin-tags/admin-tags.component';
import {AdminDisciplineComponent} from './admin/admin-discipline/admin-discipline.component';
import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'findsupporters', component: FindsupportersComponent, canActivate: [ CanActivateRouteGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'supporter-landing', component: SupporterLandingComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'supporter-appointments', component: SupporterAppointmentsComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'supporter-settings', component: SupporterSettingsComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'supporter-availability', component: SupporterAvailabilityComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'admin-landing', component: AdminLandingComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'admin-reports', component: AdminReportsComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'admin-applications', component: AdminApplicationsComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'admin-tags', component: AdminTagsComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'admin-discipline', component: AdminDisciplineComponent, canActivate: [ CanActivateRouteGuard] }
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

