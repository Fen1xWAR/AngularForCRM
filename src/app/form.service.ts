import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable, throwError} from "rxjs";
import {IOperationResult} from "./services/user-data.service";
import {catchError, map} from "rxjs/operators";


export interface Form{
  formId : string;
  formContent : string;
}
@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'https://localhost:7002/api';

  constructor(private http: HttpClient) { }
  getFormById(id: string): Observable<Form> {
    return this.http.get<IOperationResult<Form>>(`${this.apiUrl}/Form/GetById/${id}`).pipe(
      map(result => {
        if(result.successful && result.result){
          return result.result
        }
        throw new Error(result.errorMessage)
      }),
      catchError(err => {
        throw new Error(err.error.errorMessage)
      })
    )
  }
  updateForm(form : Form) {
    return this.http.post(`${this.apiUrl}/Form/Update`, form).pipe()
  }

}
