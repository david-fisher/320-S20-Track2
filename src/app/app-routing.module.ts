import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SupporterLandingComponent} from './supporter/supporter-landing/supporter-landing';
import {SupporterAppointmentsComponent} from './supporter/supporter-appointments/supporter-appointments.module';
import {SupporterSettingsComponent} from './supporter/supporter-settings/supporter-settings';
import {SupporterAvailabilityComponent} from './supporter/supporter-availability/supporter-availability';
import {AdminLandingComponent} from './admin/admin-landing/admin-landing';
import {AdminReportsComponent} from './admin/admin-reports/admin-reports';
import {AdminApplicationsComponent} from './admin/admin-applications/admin-applications';
import {AdminTagsComponent} from './admin/admin-tags/admin-tags';
import {AdminDisciplineComponent} from './admin/admin-discipline/admin-discipline';

const routes: Routes = [
  { path: 'supporter-landing', component: SupporterLandingComponent },
  { path: 'supporter-appointments',      component: SupporterAppointmentsComponent },
  { path: 'supporter-settings',      component: SupporterSettingsComponent },
  { path: 'supporter-availability',      component: SupporterAvailabilityComponent },
  { path: 'admin-landing',      component: AdminLandingComponent },
  { path: 'admin-reports',      component: AdminReportsComponent },
  { path: 'admin-applications',      component: AdminApplicationsComponent },
  { path: 'admin-tags',      component: AdminTagsComponent },
  { path: 'admin-discipline',      component: AdminDisciplineComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
