import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 0 || error.status === 500) {
          // Handle CONNECTION REFUSED error
          console.error('CONNECTION REFUSED');
          this.router.navigate(['/error']);
          return EMPTY;
        }
        return EMPTY;
      })
    )
  }

}
