import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./auth.service";
import {apiUrl} from "../variables";

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
  getServicesByPsychologistId(id : string): Observable<Service[]> {
    return this.http.get<IOperationResult<Service[]>>(`${apiUrl}/Service/GetByPsychologistId/${id}`).pipe(
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
    return this.http.get<IOperationResult<Service>>(`${apiUrl}/Service/GetById/${id}`).pipe(
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
