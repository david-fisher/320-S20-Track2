import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {FaqComponent} from './faq/faq.component';

import {CanActivateRouteGuard} from './can-activate-route.guard';
import {CanStudentActivateRouteGuard} from './can-student-activate-route.guard';
import {CanSupporterActivateRouteGuard} from './can-supporter-activate-route.guard';

import {StudentFindsupportersComponent} from './student/student-findsupporters/student-findsupporters.component';
import {StudentProfileComponent} from './student/student-profile/student-profile.component';
import {StudentRatesupporterComponent} from './student/student-ratesupporter/student-ratesupporter.component';
import {SupporterLandingComponent} from './supporter/supporter-landing/supporter-landing.component';
import {SupporterAppointmentsComponent} from './supporter/supporter-appointments/supporter-appointments.component';
import {SupporterSettingsComponent} from './supporter/supporter-settings/supporter-settings.component';
import {SupporterAvailabilityComponent} from './supporter/supporter-availability/supporter-availability.component';
import {AdminReportsComponent} from './admin/admin-reports/admin-reports.component';
import {AdminApplicationsComponent} from './admin/admin-applications/admin-applications.component';
import {AdminTagsComponent} from './admin/admin-tags/admin-tags.component';
import {AdminDisciplineComponent} from './admin/admin-discipline/admin-discipline.component';
import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';
import {StudentMyappointmentsComponent} from './student/student-myappointments/student-myappointments.component';
import {StudentMakeappointmentComponent} from './student/student-makeappointment/student-makeappointment.component';
import {CreateaccountComponent} from './createaccount/createaccount.component';
import {SupporterProfileComponent} from './supporter/supporter-profile/supporter-profile.component';
import {CanAdminActivateRouteGuard} from "./can-admin-activate-route.guard";

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'createaccount/:type', component: CreateaccountComponent},
  { path: 'student-findsupporters', component: StudentFindsupportersComponent, canActivate: [ CanStudentActivateRouteGuard]},
  { path: 'student-profile/:appt_id', component: StudentProfileComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'supporter-profile/:appt_id', component: SupporterProfileComponent, canActivate: [ CanActivateRouteGuard] },
  { path: 'student-myappointments', component: StudentMyappointmentsComponent, canActivate: [ CanStudentActivateRouteGuard] },
  { path: 'student-ratesupporter/:name/:appt_id/:supp_id', component: StudentRatesupporterComponent, canActivate: [ CanStudentActivateRouteGuard] },
  { path: 'student-makeappointment', component: StudentMakeappointmentComponent, canActivate: [ CanStudentActivateRouteGuard] },
  { path: 'supporter-landing', component: SupporterLandingComponent, canActivate: [ CanSupporterActivateRouteGuard] },
  { path: 'supporter-appointments', component: SupporterAppointmentsComponent, canActivate: [ CanSupporterActivateRouteGuard] },
  { path: 'supporter-settings', component: SupporterSettingsComponent, canActivate: [ CanSupporterActivateRouteGuard] },
  { path: 'supporter-availability', component: SupporterAvailabilityComponent, canActivate: [ CanSupporterActivateRouteGuard] },
  // The below pages' CanActivate needs to change once admin is implemented
  { path: 'admin-landing', component: AdminLandingComponent, canActivate: [ CanAdminActivateRouteGuard] },
  { path: 'admin-reports', component: AdminReportsComponent, canActivate: [ CanAdminActivateRouteGuard] },
  { path: 'admin-applications', component: AdminApplicationsComponent, canActivate: [ CanAdminActivateRouteGuard] },
  { path: 'admin-tags', component: AdminTagsComponent, canActivate: [ CanAdminActivateRouteGuard] },
  { path: 'admin-discipline', component: AdminDisciplineComponent, canActivate: [ CanAdminActivateRouteGuard] },
  { path: 'admin-discipline/:filedAgainstID', component: AdminDisciplineComponent, canActivate: [ CanAdminActivateRouteGuard] }
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

