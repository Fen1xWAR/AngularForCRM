import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';

import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./auth.service";
import {Service} from "./service.service";


export interface Visit {
  visitId: string,
  clientId: string,
  dateTime: Date,
  clientNote: string,
  psychologistDescription: string,
  serviceId: string,
  psychologistId: string

}


@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'https://localhost:7002/api';

  constructor(private http: HttpClient) {
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

  createVisit(visit: Partial<Visit>): Observable<string> {
    return this.http.put<IOperationResult<string>>(`${this.apiUrl}/Visit/Insert`, visit).pipe(
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
    )
  }
}
