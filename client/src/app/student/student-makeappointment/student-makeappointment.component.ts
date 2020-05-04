import {SUPPORTERS} from './mock-supporters';
import {Supports} from './supports';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter, CalendarWeekViewBeforeRenderEvent} from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import {HttpClient} from '@angular/common/http';
import {InterestTags} from '../../admin/admin-tags/interest-tag';
import {CookieService} from 'ngx-cookie-service';
import {StudentCancelAppointmentDialog} from "../student-myappointments/student-myappointments.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UhOhDialog} from "../../createaccount/createaccount.component";

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

// tslint:disable-next-line max-classes-per-file
@Component({
  selector: 'app-student-makeappointment',
  templateUrl: './student-makeappointment.component.html',
  styleUrls: ['./student-makeappointment.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styles: [
    `
      .cal-week-view .cal-day-columns .bg-pink {
        background-color: #B71C1C !important;
      }
    `,
  ],
})

export class StudentMakeappointmentComponent {
  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  excludeDays: number[] = [0, 6];
  selectedTags;
  pageTags;
  pageSupporters;
  selectedSupporter = null;
  pageTypes;
  selectedType;
  userID;
  date;
  time;
  typeToID = {};

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient, private cookieService: CookieService, public dialog: MatDialog) {
    this.pageTags = this.tags_https();
    this.pageSupporters = this.supporter_https();
    console.log(this.pageSupporters);
    this.pageTypes = this.types_https();
    console.log(this.pageTypes);
    this.userID = this.getUserId();

  }

  tags_https()  {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    return result;
  }

  types_https() {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type', {}).subscribe(res => {
      for (const tag of Object.values(res)) {
        this.typeToID[tag[1]] = tag[0];
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    return result;
  }

  supporter_https() {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/supporters').subscribe(res => {
      console.log(res);
      // tslint:disable-next-line:forin
      for (const id in res) {
        const temp = res[id];
        temp.id = id;
        result.push(temp);
      }
    });
    console.log(result);
    return result;
  }

  getUserId() {
    this.userID = this.cookieService.get('user_id');
  }

  get supporterList() {
    let array = [];
    if (this.selectedTags === undefined) {
      return this.pageSupporters;
    } else if (this.selectedTags.length === 0) {
      return this.pageSupporters;
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let x = 0; x < this.pageSupporters.length; x++ ) {
        let apptType = false;
        let boxsChecked = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.pageSupporters[x].apptTypes.length; i++) {

          if ( this.pageSupporters[x].apptTypes[i][0] === this.selectedType[0] ) {
            apptType = true;
          }
        }
        // tslint:disable-next-line:prefer-for-of
        for (let y = 0; y < this.selectedTags.length; y++ ) {
          // tslint:disable-next-line:prefer-for-of
          for (let z = 0; z < this.pageSupporters[x].tags.length ; z++ ) {
            if ( this.selectedTags[y].name === this.pageSupporters[x].tags[z][0] ) {
              boxsChecked++;
            }
          }
        }

        if (apptType === true  && boxsChecked === this.selectedTags.length ) {
          array.push(this.pageSupporters[x]);
        }
      }
      return array;
    }

  }

  getSched() {
    console.log(this.selectedSupporter);
    if (this.selectedSupporter[0].availability === null) {
      alert('sorry this supporter is unavailable');
    }

    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < this.selectedSupporter[0].availability.length; x++) {
      console.log(this.selectedSupporter[0].availability[x]);
    }
  }

  refreshView(): void {
    this.refresh();
  }


  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    if (this.selectedSupporter === null) {
      return;
    }
    if ( segment.cssClass === 'bg-pink') {
      return;
    }
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    const year = dragToSelectEvent.start.getFullYear().toString();
    const month = String(dragToSelectEvent.start.getMonth() ).padStart(2, '0');
    const day = String(dragToSelectEvent.start.getDate()).padStart(2, '0');
    const hour = String(dragToSelectEvent.start.getHours()).padStart(2, '0');
    const min = String(dragToSelectEvent.start.getMinutes()).padStart(2, '0');
    this.date = year + '-' + month + '-' + day;
    this.time = hour + ':' + min + ':00';

    this.events = [...this.events, dragToSelectEvent];
    if ( segment.cssClass === 'bg-pink') {
      console.log('lslsls')
    }
    const segmentPosition = segmentElement.getBoundingClientRect();
    console.log(segmentPosition)
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup').pipe(
          finalize(() => {
            this.make_appointment(this.generate_appointment_object());
          })
        ))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        if ( segment.cssClass === 'bg-pink') {
          return;
        }
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if ( segment.cssClass === 'bg-pink') {
          this.refresh();
        } else if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
          this.refresh();
        }


      });

  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    if (this.selectedSupporter === null) {
      return;
    }
    renderEvent.hourColumns.forEach((hourColumn) => {
      hourColumn.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          //this.selectedSupporter.availability.splice(parseInt(x), 1);
          if (!(
            (segment.date.getHours() >= 12 &&
            segment.date.getHours() <= 16 &&
            segment.date.getDay() === 2)

            ||

            (segment.date.getHours() >= 9 &&
              segment.date.getHours() <= 13 &&
              segment.date.getDay() === 4)

          )) {
            segment.cssClass = 'bg-pink';
          }
        });
      });
    });
  }

  generate_appointment_object() {
    const appointment = {
      student_id: this.cookieService.get('user_id'),
      supporter_id: this.selectedSupporter[0].id,
      appt_date: this.date,
      start_time: this.time,
      duration: 45,
      type: this.typeToID[this.selectedType],
      cancelled: false,
      rating: '0',
      recommended: false
    };
    console.log(appointment);
    return appointment;
  }

  make_appointment(appointment) {
    console.log('Make appointment debug');
    appointment = this.generate_appointment_object();
    console.log(appointment);
    const sched = false;
    let appt_detail = ['Date: ' + appointment.appt_date, 'Start Time: ' + appointment.start_time, 'Duration: ' + appointment.duration];
    const dialogRef = this.dialog.open(AppointmentConfirmationDialog, {
      data: {details: appt_detail, schedule: sched}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.scheduled) {
        this.http.post('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments',
          appointment).subscribe( res => {
            this.dialog.open(AppointmentSuccessDialog);
        }, error => {
            this.dialog.open(UhOhDialog);
        });
      }
    });
  }

}



// Confirmation dialog component
@Component({
  selector: 'appointment-confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class AppointmentConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<AppointmentConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  onNoClick() {
    this.dialogRef.close({scheduled: false});
  }
  onCancelClick() {
    this.dialogRef.close({scheduled: true});
  }
}

// Appointment success dialog component
@Component({
  selector: 'appointment-success-dialog',
  templateUrl: 'success-dialog.html',
})
export class AppointmentSuccessDialog {}


