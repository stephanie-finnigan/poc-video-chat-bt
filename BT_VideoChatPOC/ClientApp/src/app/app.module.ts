import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { JoinComponent } from './join/join.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { VideoComponent } from './video/video.component';
import { CalendarComponent } from './calendar/calendar.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    JoinComponent,
    SubscriberComponent,
    VideoComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: CalendarComponent },
      { path: 'subscriber', component: SubscriberComponent },
      { path: 'video', component: VideoComponent },
    ]),
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
