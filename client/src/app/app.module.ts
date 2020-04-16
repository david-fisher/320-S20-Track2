import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { StarRatingModule } from 'angular-star-rating';
import { MatSliderModule } from '@angular/material/slider';
import {ClickMeComponent} from './app.click-me.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { CanActivateRouteGuard } from './can-activate-route.guard';
import { AuthService } from './auth/auth.service';
import { StudentFindsupportersComponent } from './student/student-findsupporters/student-findsupporters.component';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';
import { AdminApplicationsComponent } from './admin/admin-applications/admin-applications.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminDisciplineComponent } from './admin/admin-discipline/admin-discipline.component';
import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';
import { AdminReportsComponent } from './admin/admin-reports/admin-reports.component';
import { AdminTagsComponent } from './admin/admin-tags/admin-tags.component';
import { MatListModule } from '@angular/material/list';
import { SupporterAppointmentsComponent } from './supporter/supporter-appointments/supporter-appointments.component';
import { SupporterAvailabilityComponent } from './supporter/supporter-availability/supporter-availability.component';
import { SupporterLandingComponent } from './supporter/supporter-landing/supporter-landing.component';
import { SupporterSettingsComponent } from './supporter/supporter-settings/supporter-settings.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { StudentMyappointmentsComponent } from './student/student-myappointments/student-myappointments.component';
import { StudentRatesupporterComponent } from './student/student-ratesupporter/student-ratesupporter.component';
import { StudentMakeappointmentComponent } from './student/student-makeappointment/student-makeappointment.component';
import { CreateaccountComponent } from './createaccount/createaccount.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatFileUploadModule} from 'mat-file-upload';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FaqComponent,
    LoginComponent,
    StudentFindsupportersComponent,
    ClickMeComponent,
    StudentProfileComponent,
    AdminApplicationsComponent,
    AdminDisciplineComponent,
    AdminLandingComponent,
    AdminReportsComponent,
    AdminTagsComponent,
    SupporterAppointmentsComponent,
    SupporterAvailabilityComponent,
    SupporterLandingComponent,
    SupporterSettingsComponent,
    StudentMyappointmentsComponent,
    StudentRatesupporterComponent,
    StudentMakeappointmentComponent,
    CreateaccountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    FlexLayoutModule,
    MatInputModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule,
    NgbModule,
    StarRatingModule.forRoot(),
    MatButtonToggleModule,
    MatFileUploadModule
  ],
  providers: [CookieService, AuthService, CanActivateRouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
