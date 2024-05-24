import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
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
  private isLoginIn$$ = new BehaviorSubject<boolean>(false);
  isLoginIn$ = this.isLoginIn$$.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.setLoginIn(!!this.getJwtToken());
  }

  public setLoginIn(value: boolean) {
    this.isLoginIn$$.next(value);
  }

  public encrypt(password: string): string {
    console.log(CryptoJS.SHA256(password).toString());
    return CryptoJS.SHA256(password).toString();
  }

  login(user: UserAuth): Observable<Tokens> {

    user.deviceId = this.getRefreshToken()?.deviceId;
    user.password = this.encrypt(user.password)
    return this.http.post<IOperationResult<Tokens>>(`${this.apiUrl}/login`, user).pipe(
      map(result => {
        if (result.successful && result.result != undefined) {
          const tokens = result.result;
          this.setTokens(tokens);
          this.setLoginIn(true)
          console.log(this.isLoginIn$)
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
        console.log(result);
        if (result.successful && result.result != undefined) {
          const tokens = result.result;
          console.log(tokens)
          this.setTokens(tokens);
          this.setLoginIn(true)
          return tokens;
        } else {
          throw new Error(result.errorMessage);
        }
      })
    );
  }

  register(user: UserRegModel): Observable<Tokens> {

    return this.http.post<IOperationResult<Tokens>>(`${this.apiUrl}/Register`, user).pipe(
      map(result => {
        if (result.successful && result.result != undefined) {
          const tokens = result.result;
          this.setTokens(tokens);
          this.setLoginIn(true)
          return tokens;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      catchError(error => {
        console.error(error)
        const errorMessage = error.error.errorMessage;
        throw new Error(errorMessage);
      })
    );
  }


  logout(): void {
    console.log('loggingOut')
    this.setLoginIn(false)
    this.cookieService.delete("jwtToken")
    setTimeout(()=>location.href='/', 200)


  }

  public setTokens(tokens: Tokens): void {
    const expiry = new Date(Date.now());
    expiry.setDate(expiry.getDate() + 7);
    const options = {
      expires: expiry,
      path: '/',
      httpOnly: true,
      sameSite: 'Strict' as SameSite,
    }

    this.cookieService.set("jwtToken", tokens.jwtToken, options);
    this.cookieService.set('refreshToken', JSON.stringify(tokens.refreshToken), options);
    // const expiryDate = new Date();
    // expiryDate.setDate(expiryDate.getDate() + 7); // Set expiration to 7 days from now
    //
    // const options = {
    //   expires: expiryDate,
    //   path: '/',
    //   httpOnly: true,
    //   sameSite: 'Strict' as SameSite,
    // };
    // this.cookieService.set('tokens', JSON.stringify(tokens), options);
    // // localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  getTokens(): Tokens | null {
    const jwt = this.getJwtToken()
    const refreshToken = this.getRefreshToken()
    if (jwt != null && refreshToken != null)
      return {
        jwtToken: jwt,
        refreshToken: refreshToken,
      }
    return null
  }

  getJwtToken(): string | null {
    const token = this.cookieService.get('jwtToken');
    // const tokens = this.getTokens();
    if (token) {
      return token
    } else {
      return null;
    }
  }

  getRefreshToken(): RefreshToken | null {
    const token = this.cookieService.get('refreshToken');
    if (token) {
      try {
        return JSON.parse(token)
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }
}
