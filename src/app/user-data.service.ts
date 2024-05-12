import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {IOperationResult} from "./auth.service";
import {Observable} from "rxjs";


export interface UserData {
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private apiUrl = 'https://localhost:7002/api/User';

  constructor(private http: HttpClient) {

  }

  getUserData(): Observable<UserData> {
    return this.http.get<IOperationResult<UserData>>(`${this.apiUrl}/GetCurrentUserData`).pipe(
      map(result => {
        if (result.successful && result.result != undefined) {
          // console.log(result.result);
          return result.result;
        } else {
          throw new Error(result.errorMessage);
        }
      }),
      catchError(error => {
        const errorMessage = error.error.errorMessage;
        throw new Error(errorMessage);
      })
    );
  }
}
