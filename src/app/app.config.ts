import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';``
import {routes} from './app.routes';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {AuthService} from "./services/auth.service";
import {UserDataService} from "./services/user-data.service";
import {RoleGuardService} from "./services/role-guard.service";
import {LoadingInterceptor} from "./interceptor/loading.interceptor";
import {LoaderService} from "./services/loader.service";
import {FormService} from "./services/form.service";
import {ClientService} from "./services/client.service";
import {VisitService} from "./services/visit.service";
import {HeaderComponent} from "./header/header.component";
import {ContactService} from "./services/contact.service";
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {Select2} from "ng-select2-component";
import {PsychologistService} from "./services/psychologist.service";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru'
import {ErrorInterceptor} from "./interceptor/error-interceptor";
import {ScheduleService} from "./services/schedule.service";
import {ServiceService} from "./services/service.service";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateCustomParserFormatter} from "./services/ngb-date-custom-parser-formatter.service";
import {ToastAlertsComponent} from "./toast-alerts/toast-alerts.component";
import {ToastService} from "./services/Toast/toast-service";
import {CalendarService} from "./services/calendar.service";


registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    AuthService,
    UserDataService,
    RoleGuardService,
    LoaderService,
    VisitService,
    FormService,
    ClientService,
    HeaderComponent,
    Select2,
    ServiceService,
    ContactService,
    PsychologistService,
    MyProfileComponent,
    PsychologistService,
    ScheduleService,
    ToastService,
    CalendarService,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    {provide: LOCALE_ID, useValue: 'ru'},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
};
