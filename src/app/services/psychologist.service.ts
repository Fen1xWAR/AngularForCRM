import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {IOperationResult} from "./auth.service";
import {catchError, map} from "rxjs/operators";
export interface Psychologist {
  psychologistId: string;
  userId: string;
  about : string
  // Add other fields if necessary
}

export interface PsychologistFullData {
  psychologistId: string;
  name: string;
  lastName: string;
  middlename?: string | undefined;
  about: string;
  age: number
}

@Injectable({
  providedIn: 'root'
})
export class PsychologistService {

  private apiUrl = 'https://localhost:7002/api';

  constructor(private http: HttpClient) { }

  getPsychologists(pageNumber: number, pageSize: number): Observable<Psychologist[]> {
    const url = `${this.apiUrl}/Psychologist/Get?page=${pageNumber}&limit=${pageSize}`;
    return this.http.get<IOperationResult<Psychologist[]>>(url).pipe(
      map (result=>{
        if (result.successful && result.result){
          return result.result
        }
        throw new Error(result.errorMessage);
      })
    )


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

  getPsychologistByUserId(id: string): Observable<Psychologist> {
    return this.http.get<IOperationResult<Psychologist>>(`${this.apiUrl}/Psychologist/GetByUserId/${id}`).pipe(
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
  updatePsychologist(psyhologist : Psychologist){
    return this.http.post(`${this.apiUrl}/Psychologist/Update`, psyhologist).pipe()
  }
}
