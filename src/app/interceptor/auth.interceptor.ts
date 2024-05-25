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


  private excludedUrls: string[] = ['/login', '/register', '/refreshToken'];

  private excludeRoutes: string[] = ['/forclient', '/psychologist'];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

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

      if (!this.isExcludeRoutes(this.router.url)) {
        return next.handle(request);
      }
      location.hash = '/login';

    }

    return next.handle(request);
  }

  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some((excludedUrl) => url.includes(excludedUrl));
  }

  private isExcludeRoutes(url: any): boolean {
    return this.excludeRoutes.some((excludedUrl) => url.includes(excludedUrl));
  }


}
