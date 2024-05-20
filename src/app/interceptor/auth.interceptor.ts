import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {delay, EMPTY, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }

  private isRefreshing: boolean = false;
  private excludedUrls: string[] = ['/login', '/register', '/refreshToken'];

  private excludeRoutes : string[] = ['/forclient', '/psychologist'];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(this.isExcludeRoutes( this.router.url)){
      return next.handle(request);
    }
    if (this.isExcludedUrl(request.url)) {
      return next.handle(request);
    }

    const jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    } else {
      this.authService.refreshTokens();
      location.href = '/login';
    }

    return next.handle(request).pipe(
      catchError((error) => {
          // Handle other errors
          console.error('HTTP ERROR', error);
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }


        return throwError(() => error);
      })
    );
  }

  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some((excludedUrl) => url.includes(excludedUrl));
  }
  private isExcludeRoutes(url : any): boolean {
    console.log(url)
    return this.excludeRoutes.some((excludedUrl) => url.includes(excludedUrl));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.getTokens()) {
        return this.authService.refreshTokens().pipe(
          switchMap(() => {
            const newJwtToken = this.authService.getJwtToken();

            if (newJwtToken) {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newJwtToken}`,
                },
              });
            } else {
              this.router.navigate(['/login']);
            }

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.router.navigate(['/login']);

            return throwError(() => error);
          }),
          finalize(() => {
            this.isRefreshing = false;
          }),
        );
      }
    }

    return next.handle(request);
  }
}
