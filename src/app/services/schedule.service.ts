import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {IOperationResult} from "./auth.service";
import {Time} from "@angular/common";
import {catchError, map} from "rxjs/operators";


export interface Schedule {
  scheduleId: string;
  psychologistId: string;
  workDay: Date;
  startTime: Time;
  endTime: Time;
  isBooked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }


  private apiUrl = 'https://localhost:7002/api/Schedule';

  updateSchedule(Schedule: Schedule) {
    return this.http.post(`${this.apiUrl}/Update`, Schedule)
  }

  getById(id: string) : Observable<Schedule>{
    return this.http.get<IOperationResult<Schedule>>(`${this.apiUrl}/GetById/${id}`).pipe(
      map(result=>{
        if(result.successful && result.result){
          return result.result;
        }
        throw new Error(result.errorMessage);
      }),
      catchError(err=> {
        throw new Error(err.error.errorMessage)
      })
    )
  }
  getByPsychologistIdAndDay( id: string,day: string): Observable<Schedule[]> {
      return   this.http.post<IOperationResult<Schedule[]>>(`${this.apiUrl}/GetByPsychologistIdAndTime`,{
          psychologistId:id,
          day:day,
        }).pipe(
          map(result => {
            if (result.successful && result.result) {
              return result.result;
            } else {
              throw  new Error(result.errorMessage);
            }
          }),
          catchError(err => {
            throw new Error(err)
          })
        )
  }
}
