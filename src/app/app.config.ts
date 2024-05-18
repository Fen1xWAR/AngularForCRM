import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

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
    ContactService,
    PsychologistService,
    MyProfileComponent,
    PsychologistService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
};
