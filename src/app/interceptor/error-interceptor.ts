import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, finalize} from "rxjs/operators";
import {EMPTY, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
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
          if (!this.isRefreshing)
            this.handle401Error(req, next).subscribe()
          else
            return EMPTY
          location.href = '/login'
        }
        return EMPTY;
      })
    )
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true
    if (this.authService.getTokens()) {
      this.authService.refreshTokens().subscribe(
        tokens => {
          this.authService.setTokens(tokens);

          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.jwtToken}`,
            },
          });
          this.isRefreshing = false
          location.reload()
          return next.handle(request);

        },
        finalize(() => {
          location.reload()
        }))

    } else {
      location.href = '/login'
    }

    return EMPTY

  }

}
