import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./auth.service";

export interface Service {
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  psychologistId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = "https://localhost:7002/api";
  getServicesByPsychologistId(id : string): Observable<Service[]> {
    return this.http.get<IOperationResult<Service[]>>(`${this.apiUrl}/Service/GetByPsychologistId/${id}`).pipe(
      map (result => {
        if(result.successful && result.result){

          return result.result
        }
        else{
          throw new Error(result.errorMessage)
        }

      }),
      catchError(err => {
        throw new Error(err.error.errorMessage)
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

}
