import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable, throwError} from "rxjs";
import {IOperationResult} from "./user-data.service";
import {catchError, map} from "rxjs/operators";
import {apiUrl} from "../variables";


export interface Form{
  formId : string;
  formContent : string;
}
@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }
  getFormById(id: string): Observable<Form> {
    return this.http.get<IOperationResult<Form>>(`${apiUrl}/Form/GetById/${id}`).pipe(
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
    return this.http.post(`${apiUrl}/Form/Update`, form).pipe()
  }

}
