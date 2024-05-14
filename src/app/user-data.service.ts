import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, from, Observable, of, retry, tap, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {error} from "@angular/compiler-cli/src/transformers/util";

export interface IOperationResult<T> {
  successful: boolean;
  result?: T;
  errorMessage?: string;
}

export interface UserData {
  userId: string;
  role: string;
}

export interface Contact {
  contactId?: string;
  phoneNumber?: string | undefined;
  name: string;
  lastname: string;
}

export interface Visit {

}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private currentUserData: UserData | undefined;
  private currentUserContact: Contact | undefined;
  private currentUserVisits: Visit[] | undefined;
  private apiUrl = 'https://localhost:7002/api/CurrentUser';

  constructor(private http: HttpClient) {
  }

  getUserData(): Observable<UserData> {
    if (this.currentUserData) {
      return of(this.currentUserData);
    } else {
      return this.loadUserData();
    }
  }

  getUserContact(): Observable<Contact> {
    if (this.currentUserContact) {
      return of(this.currentUserContact);
    } else {
      return this.loadUserContact()
    }
  }

  getUserVisits() : Observable<Visit[]> {
    if (this.currentUserVisits) {
      return of(this.currentUserVisits);
    }
    return this.loadUserVisits()
  }

  loadUserContact(): Observable<Contact> {
    console.log("Getting user data");
    return this.http.get<IOperationResult<Contact>>(`${this.apiUrl}/GetContact`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserContact = result.result;
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      catchError(err => {
        throw new Error(err);
      })
    );
  }

  loadUserData(): Observable<UserData> {
    return this.http.get<IOperationResult<UserData>>(`${this.apiUrl}/GetCurrentUserData`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserData = result.result;
          return result.result;
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

  loadUserVisits(): Observable<Visit[]> {
    return this.http.get<IOperationResult<Visit[]>>(`${this.apiUrl}/GetVisits`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserVisits = result.result;
          return result.result;
        }
        throw new Error(result.errorMessage);
      }),
      catchError(error => {
          const errorMessage = error.error.errorMessage
          throw new Error(errorMessage)
        }
      )
    );
  }
}
