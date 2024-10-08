import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {IOperationResult} from "./auth.service";
import {catchError, map} from "rxjs/operators";
import {Psychologist} from "./psychologist.service";
import {apiUrl} from "../variables";
export interface Client{
  clientId: string;
  formId : string;
  currentProblem : string;
  userId : string;
}
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }
  getClientByUserId(userId: string): Observable<Client> {
    return this.http.get<IOperationResult<Client>>(`${apiUrl}/Client/GetByUserId/${userId}`).pipe(
      map(result => {
        if (result.successful && result.result) {
          return result.result;
        }
        throw new Error(result.errorMessage);
      }),
      catchError(err => {
        throw new Error(err)
      })
    );
  }
  getClientById(id: string): Observable<Client> {
    return this.http.get<IOperationResult<Client>>(`${apiUrl}/Client/GetById/${id}`).pipe(
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
  updateClient(client : Client): Observable<any> {
    return this.http.post(`${apiUrl}/Client/Update`, client)
  }
}
