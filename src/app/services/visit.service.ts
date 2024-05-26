import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./auth.service";
import {apiUrl} from "../variables";


export interface Visit {
  visitId: string,
  clientId: string,
  scheduleId : string,
  clientNote: string,
  psychologistDescription: string,
  serviceId: string,
  psychologistId: string

}


@Injectable({
  providedIn: 'root'
})
export class VisitService {

  constructor(private http: HttpClient) {
  }

  getVisitById(id: string): Observable<Visit> {
    return this.http.get<IOperationResult<Visit>>(`${apiUrl}/Visit/GetById/${id}`).pipe(
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
  getVisitByScheduleId(id: string): Observable<Visit> {
    return this.http.get<IOperationResult<Visit>>(`${apiUrl}/Visit/GetByScheduleId/${id}`).pipe(
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


  updateVisit(visit: Visit): void {
    this.http.post(`${apiUrl}/Visit/Update`, visit).subscribe();
  }

  createVisit(visit: Partial<Visit>): Observable<string> {
    return this.http.put<IOperationResult<string>>(`${apiUrl}/Visit/Insert`, visit).pipe(
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
