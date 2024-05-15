import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CookieService, SameSite} from "ngx-cookie-service";

export interface IOperationResult<T> {
  successful: boolean;
  errorMessage?: string;
  result?: T;
}

interface UserAuth {
  email: string;
  password: string;
  deviceId?: string;
}

interface UserRegModel {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface Tokens {
  jwtToken: string;
  refreshToken: RefreshToken;
}

interface RefreshToken {
  token: string;
  deviceId: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7002/api/User';

  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  login(user: UserAuth): Observable<Tokens> {

    user.deviceId = this.getRefreshToken()?.deviceId;
    return this.http.post<IOperationResult<Tokens>>(`${this.apiUrl}/login`, user).pipe(
      map(result => {
        if (result.successful && result.result != undefined) {
          const tokens = result.result;
          this.setTokens(tokens);

          return tokens;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      catchError(error => {
        const errorMessage = error.error.errorMessage;
        throw new Error(errorMessage);
      })
    );
  }

  refreshTokens(): Observable<Tokens> {
    const tokens = this.getTokens();
    if (tokens == null) {
      return EMPTY;
    }
    return this.http.post<IOperationResult<Tokens>>(`${this.apiUrl}/RefreshToken`, tokens).pipe(
      map(result => {
        if (result.successful && result.result != undefined) {
          const tokens = result.result;
          console.log(tokens)
          this.setTokens(tokens);

          return tokens;
        } else {
          this.logout();
          throw new Error(result.errorMessage);
        }
      }),
      catchError(error => {
        this.logout()
        const errorMessage = error.error.errorMessage;
        throw new Error(error);
      })
    );
  }

  register(user: UserRegModel): Observable<Tokens> {
    return this.http.post<IOperationResult<Tokens>>(`${this.apiUrl}/Register`, user).pipe(
      map(result => {
        if (result.successful && result.result != undefined) {
          const tokens = result.result;
          this.setTokens(tokens);

          return tokens;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      catchError(error => {
        const errorMessage = error.error.errorMessage;
        throw new Error(errorMessage);
      })
    );
  }


  logout(): void {
    this.cookieService.delete("tokens")
    // localStorage.removeItem('tokens');
  }

  private setTokens(tokens: Tokens): void {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Set expiration to 7 days from now

    const options = {
      expires: expiryDate,
      path: '/',
      httpOnly: true,
      sameSite: 'Strict' as SameSite,
    };
    this.cookieService.set('tokens', JSON.stringify(tokens), options);
    // localStorage.setItem('tokens', JSON.stringify(tokens));
  }
  getTokens(): Tokens | null {
    const tokensJson = this.cookieService.get('tokens');
    console.log(tokensJson);
    // const tokensJson = localStorage.getItem('tokens');
    if (tokensJson) {
      return JSON.parse(tokensJson);
    } else {
      return null;
    }
  }

  getJwtToken(): string | null {
    const tokens = this.getTokens();
    if (tokens) {
      return tokens.jwtToken;
    } else {
      return null;
    }
  }

  getRefreshToken(): RefreshToken | null {
    const tokens = this.getTokens();
    if (tokens) {
      return tokens.refreshToken;
    } else {
      return null;
    }
  }
}
