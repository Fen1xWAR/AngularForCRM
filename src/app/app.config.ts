import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HttpClientModule, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {AuthService} from "./services/auth.service";
import {UserDataService} from "./services/user-data.service";

import {RoleGuardService} from "./services/role-guard.service";
import {LoadingInterceptor} from "./services/loaderStuff/loading.interceptor";
import {LoaderService} from "./services/loaderStuff/loader.service";
import {FormService} from "./form.service";
import {ClientService} from "./client.service";
import {VisitService} from "./services/visit.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Add this to provide HttpClient
    AuthService,
    UserDataService,
    RoleGuardService,
    LoaderService,
    VisitService,
    FormService,
    ClientService,
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
};
