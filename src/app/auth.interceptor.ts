import
{
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
}
  from
    "@angular/common/http";
import {AuthService} from "./auth.service";
import {EMPTY, Observable, of, switchMap, tap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Injectable} from "@angular/core";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) {
  }

  private isRefreshing: boolean = false;
  private excludedUrls: string[] = ['/login', '/register', '/refreshToken'];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExcludedUrl(request.url)) {
      return next.handle(request);
    }

    const jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
    } else {
      location.href = '/login';
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        if(error.status === 502) {
          return EMPTY;
        }
        else {
          return throwError(error);
        }
      })
    );
  }

  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {

      this.isRefreshing = true;

      if (this.authService.getTokens()) {
        return this.authService.refreshTokens().pipe(
          switchMap(() => {
            this.isRefreshing = false;

            const jwtToken = this.authService.getJwtToken();

            if (jwtToken) {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${jwtToken}`
                }
              });
            } else {
              // location.href = '/login';
            }

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            location.href = "/login";

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  // private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //
  //     if (this.authService.getTokens()) {
  //       return this.authService.refreshTokens().pipe(
  //         switchMap(() => {
  //           this.isRefreshing = false;
  //
  //           return next.handle(request);
  //         }),
  //         catchError((error) => {
  //           this.isRefreshing = false;
  //           // location.href = "/login"
  //
  //           return throwError(() => error);
  //         })
  //       );
  //     }
  //   }
  //
  //   return next.handle(request);
  // }
}

// private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   if (this.authService.getTokens() != null) {
//     return this.authService.refreshTokens().pipe(
//       switchMap(() => {
//         const newJwtToken = this.authService.getJwtToken();
//         request = request.clone({
//           setHeaders: {
//             Authorization: `Bearer ${newJwtToken}`
//           }
//         });
//         return next.handle(request);
//       }),
//       catchError(error => {
//         // this.authService.clearTokens();
//         location.href = '/login';
//         return of(null as unknown as HttpEvent<any>); // Return an empty HttpEvent
//       })
//     );
//   } else {
//     location.href = '/login';
//     return of(null as unknown as HttpEvent<any>); // Return an empty HttpEvent
//   }
// }
// private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   // console.log(401)
//   if (this.authService.getTokens() != null) {
//      this.authService.refreshTokens().subscribe()
//     return next.handle(request)
//     // return this.authService.refreshTokens().pipe(
//     //   switchMap(() => {
//     //     const newJwtToken = this.authService.getJwtToken();
//     //     request = request.clone({
//     //       setHeaders: {
//     //         Authorization: `Bearer ${newJwtToken}`
//     //       }
//     //     });
//     //     return next.handle(request);
//     //   }),
//     //   catchError(error => {
//     //     // console.error(error);
//     //     location.href = '/login';
//     //     return of(null as unknown as HttpEvent<any>); // Return an empty HttpEvent
//     //   })
//     // );
//   } else {
//     location.href = '/login';
//     return of(null as unknown as HttpEvent<any>); // Return an empty HttpEvent
//   }
// }


