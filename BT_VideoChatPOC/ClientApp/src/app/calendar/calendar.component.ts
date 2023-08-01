import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, startOfDay } from 'date-fns';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import { StateService } from '../stateService';
import { error } from 'protractor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { addMinutes, min } from 'date-fns/esm/fp';


interface Meeting  {
  meetingCode: string;
  startTime: Date;
  duration: number;
}

function getEndDate(date: Date): Date {
  const dateTimezoneOffSet = date.getTimezoneOffset();
  var d2 = new Date(dateTimezoneOffSet);


  return null;
}

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .cal-week-view .cal-time-events .cal-day-column {
        margin-right: 10px;
      }

      .cal-week-view .cal-hour {
        width: calc(100% + 10px);
      }
    `,
  ],
})

export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  events$: Observable<CalendarEvent<{ meeting: Meeting }>[]>;

  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    console.log('fetchEvents method called.');
    let get_session_url = config.SAMPLE_SERVER_BASE_URL + '/session/getAllMeetings'
    this.events$ = this.http
      .get(get_session_url)
      .pipe(
        map((results: Meeting[]) => {
          return results.map((meeting: Meeting) => {
            return {
              title: 'Meeting',
              start: new Date(meeting.startTime),
              end: new Date(meeting.startTime.setMinutes(meeting.duration)),
              meta: { meeting }
            };
          });
        })
    );
  }

  clicked({ event }: { event: CalendarEvent<{ meeting: Meeting }> }): void {
    console.log('Event clicked', event);
    let get_session_url = config.SAMPLE_SERVER_BASE_URL + '/session/getSession'
    this.http.post(get_session_url, { roomName: event.meta.meeting.meetingCode }).subscribe(
      (res) => {
        this.stateService.token$ = res['token'];
        this.stateService.sessionId$ = res['sessionId'];
        this.stateService.apiKey$ = res['apiKey'];
        this.router.navigate(['/video'])
      }
    )
  }
}
