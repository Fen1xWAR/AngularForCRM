import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HttpClientModule, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";
import {AuthService} from "./auth.service";
import {UserDataService} from "./user-data.service";
import {LoadingInterceptor} from "./loading.interceptor";
import {LoadingService} from "./loading.service";
import {RoleGuardService} from "./role-guard.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Add this to provide HttpClient
    AuthService,
    UserDataService,
    LoadingService,
    RoleGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
};
