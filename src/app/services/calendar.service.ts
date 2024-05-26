import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() {

  }
  getWeekDays(weekOffset: number): any[] {
    const currentDate = new Date(Date.now());
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1) + 7 * weekOffset;
    const monday = new Date(currentDate.setDate(diff));
    let dates = []
    for (let i = 0; i < 7; i++) {

      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      dates.push(day)
    }

    const now = new Date(Date.now());
    now.setMilliseconds(0)

    return dates


  }
}
