import {SUPPORTERS} from './mock-supporters';
import {Supports} from './supports';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import {HttpClient} from '@angular/common/http';
import {InterestTags} from '../../admin/admin-tags/interest-tag';
import {CookieService} from 'ngx-cookie-service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styles: [
    `
      .disable-hover {
        pointer-events: none;
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
  selectedSupporter;
  pageTypes;
  selectedType;
  userID;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient, private cookieService: CookieService) {
    this.pageTags = this.tags_https;
    this.pageSupporters = this.supporter_https;
    this.userID = this.getUserId();
    console.log(this.userID);
    console.log('IS THE CONSTRUCTOR CONSTRUCTING?');
    this.pageTypes = this.content_https('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/options?resource=appointment_type');
  }

  get tags_https(): Array<InterestTags> {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/tags', {}).subscribe(res => {
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    return result;
  }

  content_https(url) {
    const result = [];
    this.http.get(url, {}).subscribe(res => {
      console.log(Object.values(res));
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    console.log(result);
    return result;
  }

  getUserId() {
    this.userID = this.cookieService.get('user_id');
  }

  get supporter_https() {
    const result = [];
    this.http.get('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/supporters', {params: this.selectedTags}).subscribe(res => {
      console.log(Object.values(res));
      for (const tag of Object.values(res)) {
        const newTag = {name: tag[1]};
        result.push(newTag);
      }
    });
    console.log(result);
    return result;
  }

  get supporters(): Supports[] {
    console.log(this.selectedTags);
    const list: Array<any> = [];
    if (this.selectedTags === undefined) {
      return SUPPORTERS;
    }

    if (this.selectedTags.length === 0) {
      return SUPPORTERS;
    }

    // tslint:disable-next-line:forin
    for (const x in SUPPORTERS) {
      // tslint:disable-next-line:prefer-for-of
      let count = 0;
      for (let i = 0; i <  this.selectedTags.length; i++  ) {

        if (SUPPORTERS[x].tags.includes(this.selectedTags[i])) {
          count++;
        }
      }
      if (count === this.selectedTags.length) {
        list.push(SUPPORTERS[x]);
      }
    }
    return list;
  }




  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
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
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
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
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      });
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  generate_appointment_object() {
    const appointment = {
      student_id: 20,
      supporter_id: 15,
      appt_date: '2019-12-12',
      start_time: '13:50:22',
      duration: 9876,
      type: 1,
      cancelled: false,
      rating: 0,
      recommended: false
    };
    return appointment;
  }

  make_appointment(appointment) {
    console.log('Make appointment debug');
    appointment = this.generate_appointment_object();
    console.log(appointment);
    if (confirm('Is this the appointment you wish to make?')) {
      this.http.post('https://lcqfxob7mj.execute-api.us-east-2.amazonaws.com/dev/appointments',
        appointment).subscribe();
    }
  }

}






/*@Component({
  selector: 'app-student-makeappointment',
  templateUrl: './student-makeappointment.component.html',
  styleUrls: ['./student-makeappointment.component.css']
})
export class StudentMakeappointmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}*/

/*@Component({
  selector: 'app-student-makeappointment',
  templateUrl: './student-makeappointment.component.html',
  styleUrls: ['./student-makeappointment.component.css'],
  styles: [
    `
      .cal-week-view .cal-time-events .cal-day-column {
        margin-right: 10px;
      }

      .cal-week-view .cal-hour {
        width: calc(100% + 10px);
      }
    `,
  ]
})
export class StudentMakeappointmentComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  selectedTags;
  get supporters(): Supports[] {

    let list: Array<any> = [];
    if (this.selectedTags == null) {
      return SUPPORTERS;
    }

    if (this.selectedTags.length == 0) {
      return SUPPORTERS;
    }

    // tslint:disable-next-line:forin
    for (const x in SUPPORTERS) {
      // tslint:disable-next-line:prefer-for-of
      let count: number = 0;
      for (let i = 0; i <  this.selectedTags.length; i++  ) {

        if (SUPPORTERS[x].tags.includes(this.selectedTags[i])) {
          count++;
        }
      }
      if(count == this.selectedTags.length){
        list.push(SUPPORTERS[x]);
      }
    }
    return list;
  }

  get tags(): Tags {
    return TAGS;
  }*/
