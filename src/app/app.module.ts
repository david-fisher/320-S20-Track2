import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppComponent} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import {ClickMeComponent} from './app.click-me.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


import {AppRoutingModule} from './app-routing.module';
import {SupporterLandingComponent} from './supporter/supporter-landing/supporter-landing';
import {SupporterAppointmentsComponent} from './supporter/supporter-appointments/supporter-appointments.module';
import {SupporterSettingsComponent} from './supporter/supporter-settings/supporter-settings';
import {SupporterAvailabilityComponent} from './supporter/supporter-availability/supporter-availability';
import {AdminLandingComponent} from './admin/admin-landing/admin-landing';
import {AdminReportsComponent} from './admin/admin-reports/admin-reports';
import {AdminApplicationsComponent} from './admin/admin-applications/admin-applications';
import {AdminTagsComponent} from './admin/admin-tags/admin-tags';
import {AdminDisciplineComponent} from './admin/admin-discipline/admin-discipline';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    ClickMeComponent,
    SupporterAppointmentsComponent,
    SupporterLandingComponent,
    SupporterSettingsComponent,
    SupporterAvailabilityComponent,
    AdminLandingComponent,
    AdminReportsComponent,
    AdminApplicationsComponent,
    AdminTagsComponent,
    AdminDisciplineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
