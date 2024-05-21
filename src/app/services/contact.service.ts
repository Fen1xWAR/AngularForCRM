import {Injectable} from '@angular/core';
import {Observable, retry} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./user-data.service";
import {HttpClient} from "@angular/common/http";

export interface Contact {
  contactId?: string;
  phoneNumber?: string | undefined;
  name: string;
  lastname: string;
  middlename?: string | undefined;
  dateOfBirth: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'https://localhost:7002/api';

  constructor(private http: HttpClient) {
  }

  calculateAge(dateOfBirth: Date| string) {

    if(dateOfBirth){
      const convertAge = new Date(dateOfBirth);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime())
      return  Math.floor((timeDiff / (1000 * 3600 * 24))/365);

    }
    return 0
  }

  getContactByUserId(id: string) {
    return this.http.get<IOperationResult<Contact>>(`${this.apiUrl}/Contact/GetByUserId/${id}`).pipe(
      map(result => {
        if (result.successful && result.result) {
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      catchError(err => {
        throw new Error(err)
      })
    );
  }

  loadContactById(id: string): Observable<Contact> {
    return this.http.get<IOperationResult<Contact>>(`${this.apiUrl}/Contact/GetById/${id}`).pipe(
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

  updateContact(contact: Partial<Contact>): Observable<any> {
    return this.http.post(`${this.apiUrl}/Contact/Update`, contact)
  }
}
