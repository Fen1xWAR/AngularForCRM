import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() {

  }
  getWeekDays(weekOffset: number): any[] {
    const currentDate = new Date(Date.now());
    console.log(weekOffset);
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
    // let selectedIndex = this.dates.findIndex(date => date >= now)
    // if (selectedIndex >= 0) {
    //   this.selectedDate = this.dates[selectedIndex]
    //   this.getDaySlots(this.selectedDate)
    // } else {
    //   this.slots = []
    // }
    return dates


  }
}
