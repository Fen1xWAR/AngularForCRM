import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';

import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./auth.service";
import { Visit} from "./user-data.service";




export interface Service {
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  serviceDescription: string;
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
}
