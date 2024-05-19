import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, from, Observable, of, retry, tap, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Contact} from "./contact.service";
import {Visit} from "./visit.service";

export interface IOperationResult<T> {
  successful: boolean;
  result?: T;
  errorMessage?: string;
}

export interface UserData {
  userId?: string;
  role?: string;
}





export interface UserFull {
  userId: string;
  email: string;
  password: string;
  role: string;
  contactId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private currentUserData: UserData | undefined;
  private currentUserContact: Contact | undefined;
  private currentUserVisits: Visit[] | undefined;
  private apiUrl = 'https://localhost:7002/api';

  constructor(private http: HttpClient) {
  }



  getUserContact(): Observable<Contact> {
    return this.http.get<IOperationResult<Contact>>(`${this.apiUrl}/CurrentUser/GetContact`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserContact = result.result;
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      retry(2)
      // catchError(err => {
      //   retry(1)
      //   throw new Error(err);
      // })

    );
  }

  getUserData(): Observable<UserData> {
    return this.http.get<IOperationResult<UserData>>(`${this.apiUrl}/CurrentUser/GetCurrentUserData`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserData = result.result;
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      retry(2)
      // catchError(error => {
      //   retry(1)
      //   const errorMessage = error.error.errorMessage;
      //   throw new Error(errorMessage);
      // })
    );
  }

  getUserVisits(): Observable<Visit[]> {
    return this.http.get<IOperationResult<Visit[]>>(`${this.apiUrl}/CurrentUser/GetVisits`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserVisits = result.result;
          return result.result;
        }
        throw new Error(result.errorMessage);
      }),
      catchError(error => {
          retry(1)
          const errorMessage = error.error.errorMessage
          throw new Error(errorMessage)
        }
      )
    );
  }

  loadFullUserInfo(id : string): Observable<UserFull> {
    return this.http.get< IOperationResult<UserFull>>(`${this.apiUrl}/User/GetById/${id}`).pipe(
      map(result => {
        if (result.successful && result.result) {
          return result.result;
        }
        throw new Error(result.errorMessage);
      }),
      catchError(error => {
          retry(1)
          const errorMessage = error.error.errorMessage
          throw new Error(errorMessage)
        }
      )
    );

  }

  updateUser(user: Partial<UserFull>) {
   return  this.http.post(`${this.apiUrl}/User/Update`, user)
  }
}
