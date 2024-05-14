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
import {VisitService} from "./visit.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Add this to provide HttpClient
    AuthService,
    UserDataService,
    RoleGuardService,
    LoaderService,
    VisitService,
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
};
