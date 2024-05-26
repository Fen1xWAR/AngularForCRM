import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Contact} from "./contact.service";
import {Visit} from "./visit.service";
import {apiUrl} from "../variables";

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


  constructor(private http: HttpClient) {
  }


  getUserContact(): Observable<Contact> {
    return this.http.get<IOperationResult<Contact>>(`${apiUrl}/CurrentUser/GetContact`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserContact = result.result;
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
    );
  }

  getUserData(): Observable<UserData> {
    return this.http.get<IOperationResult<UserData>>(`${apiUrl}/CurrentUser/GetCurrentUserData`).pipe(
      map(result => {
        if (result.successful && result.result) {
          this.currentUserData = result.result;
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
    );
  }

  getUserVisits(): Observable<Visit[]> {
    return this.http.get<IOperationResult<Visit[]>>(`${apiUrl}/CurrentUser/GetVisits`).pipe(
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

  loadFullUserInfo(id: string): Observable<UserFull> {
    return this.http.get<IOperationResult<UserFull>>(`${apiUrl}/User/GetById/${id}`).pipe(
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
    return this.http.post(`${apiUrl}/User/Update`, user)
  }
}
