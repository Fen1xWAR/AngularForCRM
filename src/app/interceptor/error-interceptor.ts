import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, finalize} from "rxjs/operators";
import {EMPTY, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {ToastAlertsComponent} from "../toast-alerts/toast-alerts.component";
import {ToastService} from "../services/Toast/toast-service";
import {AuthService} from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) {
  }

  private isRefreshing: boolean = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 0 || error.status === 500) {
          // Handle CONNECTION REFUSED error
          console.error('CONNECTION REFUSED');
          this.router.navigate(['/error']);
          return EMPTY;
        }
        if (error.status === 400) {
          console.error('BAD REQUEST');
          this.toastService.show(error.error.errorMessage, {classname: 'bg-danger text-light'});
          return EMPTY
        }
        if (error.status === 401) {
            this.handle401Error(req, next).subscribe()
        }
        return EMPTY;
      })
    )
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getTokens()) {


      return this.authService.refreshTokens().pipe(
        switchMap(() => {

          const newJwtToken = this.authService.getJwtToken();
          console.log(newJwtToken)
          if (newJwtToken) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newJwtToken}`,
              },
            });
          } else {
            this.authService.logout();
            this.router.navigate(['/login']);
          }

          return next.handle(request);
        }),
        finalize(() => {
          location.reload()

        }),
      )
    }


    return next.handle(request);

  }

}
