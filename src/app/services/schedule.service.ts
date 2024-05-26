import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {IOperationResult} from "./auth.service";
import {Time} from "@angular/common";
import {catchError, map} from "rxjs/operators";
import {apiUrl} from '../variables';


export interface Schedule {
  scheduleId: string;
  psychologistId: string;
  workDay: Date | string;
  startTime: Time | string;
  endTime: Time | string;
  isBooked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {
  }


  updateSchedule(Schedule: Schedule) {
    return this.http.post(`${apiUrl}/Schedule/Update`, Schedule)
  }

  remove(id: string) {
    return this.http.delete(`${apiUrl}/Schedule/Delete/${id}`);
  }

  getById(id: string): Observable<Schedule> {
    return this.http.get<IOperationResult<Schedule>>(`${apiUrl}/Schedule/GetById/${id}`).pipe(
      map(result => {
        if (result.successful && result.result) {
          return result.result;
        }
        throw new Error(result.errorMessage);
      }),
      catchError(err => {
        throw new Error(err.error.errorMessage)
      })
    )
  }

  getByPsychologistIdAndDay(id: string, day: string): Observable<Schedule[]> {
    return this.http.post<IOperationResult<Schedule[]>>(`${apiUrl}/Schedule/GetByPsychologistIdAndTime`, {
      psychologistId: id,
      day: day,
    }).pipe(
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

  createSchedule(schedule: Partial<Schedule>) {
    return this.http.put(`${apiUrl}/Schedule/Insert`, schedule)
  }
}
