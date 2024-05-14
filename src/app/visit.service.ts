import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import {Contact, Visit} from "./services/user-data.service";
import {IOperationResult} from "./services/auth.service";
import {catchError, map} from "rxjs/operators";


export interface Psychologist {
  id: string;
  userId: string;
  // Add other fields if necessary
}

export interface Service{
  serviceId: string;
  serviceName: string;
  servicePrice : string;
  serviceDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'https://localhost:7002/api';

  constructor(private http: HttpClient) {
  }


  getPsychologistById(id: string): Observable<Psychologist> {
    return this.http.get<IOperationResult<Psychologist>>(`${this.apiUrl}/Psychologist/GetById/${id}`).pipe(
      map(result => {
        if (result.successful && result.result) {
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

  getPsychologistContactByUserId(id: string): Observable<Contact> {
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
  getService(id: string): Observable<Service> {
    return this.http.get<IOperationResult<Service>>(`${this.apiUrl}/Service/GetById/${id}`).pipe(
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
  updateVisit(visit: Visit): void {
     this.http.post(`${this.apiUrl}/Visit/Update`, visit).subscribe();
  }
}
