import {SUPPORTERS} from './mock-supporters';
import {Supports} from './supports';
import {TAGS} from './mock-tags';
import {Tags} from './tags';
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
  encapsulation: ViewEncapsulation.None,
})
export class StudentMakeappointmentComponent {
  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  excludeDays: number[] = [0, 6];

  selectedSupporters;
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
  }

  constructor(private cdr: ChangeDetectorRef) {}

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
        console.log(segment.date);
        console.log(newEnd);
        console.log(this.selectedSupporters[0]);
      });

  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
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
