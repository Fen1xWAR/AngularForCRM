import {Component} from '@angular/core';
import {DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    KeyValuePipe,
    NgClass,
    NgIf
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  dates: Date[] = []
  slots: Array<Array<{ start: string, end: string, booked: boolean }>> = [
    [
      {start: '08:00', end: '09:00', booked: false},
      {start: '09:00', end: '10:00', booked: true},
      {start: '10:00', end: '11:00', booked: false},
      {start: '11:00', end: '12:00', booked: false},
      {start: '12:00', end: '13:00', booked: false},
      {start: '13:00', end: '14:00', booked: true},
      {start: '14:00', end: '15:00', booked: false},
      {start: '15:00', end: '16:00', booked: false},
      {start: '16:00', end: '17:00', booked: false},
      {start: '17:00', end: '18:00', booked: true},

    ],
    [
      {start: '09:00', end: '10:00', booked: false},
      {start: '10:00', end: '11:00', booked: false},
      {start: '16:00', end: '17:00', booked: false}
    ],
    [
      {start: '09:00', end: '10:00', booked: true},

      {start: '14:00', end: '15:00', booked: false},
      {start: '15:00', end: '16:00', booked: false},
      {start: '16:00', end: '17:00', booked: false}
    ],
    [
      {start: '09:00', end: '10:00', booked: true},
      {start: '10:00', end: '11:00', booked: false},
      {start: '11:00', end: '12:00', booked: false},
      {start: '12:00', end: '13:00', booked: false},
      {start: '13:00', end: '14:00', booked: false},
      {start: '14:00', end: '15:00', booked: false},
      {start: '15:00', end: '16:00', booked: false},
      {start: '16:00', end: '17:00', booked: false}
    ], [
      {start: '09:00', end: '10:00', booked: true},
      {start: '10:00', end: '11:00', booked: false},
      {start: '11:00', end: '12:00', booked: false},
      {start: '12:00', end: '13:00', booked: false},
      {start: '13:00', end: '14:00', booked: false},
      {start: '14:00', end: '15:00', booked: false},
      {start: '15:00', end: '16:00', booked: false},
      {start: '16:00', end: '17:00', booked: false}
    ],
    [
      {start: '09:00', end: '10:00', booked: false},
      {start: '10:00', end: '11:00', booked: false},
      {start: '11:00', end: '12:00', booked: false},
      {start: '12:00', end: '13:00', booked: false},
      {start: '13:00', end: '14:00', booked: false},
      {start: '14:00', end: '15:00', booked: false},
      {start: '15:00', end: '16:00', booked: false},
      {start: '16:00', end: '17:00', booked: false}
    ],
    [
      {start: '09:00', end: '10:00', booked: true},
      {start: '10:00', end: '11:00', booked: false},
      {start: '11:00', end: '12:00', booked: false},
      {start: '12:00', end: '13:00', booked: false},
      {start: '13:00', end: '14:00', booked: false},
      {start: '14:00', end: '15:00', booked: false},
      {start: '15:00', end: '16:00', booked: false},
      {start: '16:00', end: '17:00', booked: false}
    ],
  ];
  protected selectedDate: Date= new Date()
  protected currentDate: Date = new Date(Date.now())
  protected currentOffset = 0

  // timeSlots: Array<{ start: string, end: string }> = [

  // ];

  ngOnInit() {
    this.dates = []
    this.getWeekDays(0)

  }

  openModal(date: Date, start: string, end: string) {
    // Open the modal window with the selected date and time slot
  }

  selectScheduleDay(day: Date) {
    this.selectedDate = day;
    this.getDaySlots(day)
  }

  getDaySlots(date: Date): Array<{ start: string, end: string, booked: boolean }> {
    const dayOfWeek = date.getDay();
    return this.slots[dayOfWeek];
  }



  getWeekDays(weekOffset: number): void {
    const currentDate = new Date(Date.now());
    const dayOfWeek = currentDate.getDay() ;
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1) + 7 * weekOffset;
    const monday = new Date(currentDate.setDate(diff));
    this.dates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      this.dates.push(day);
    }
    const selectedDayIndex = this.dates.findIndex(date => date.getTime() === this.selectedDate.getTime());
    this.selectedDate = new Date(Date.now());
  }
  previousWeek(): void {
    this.currentOffset--
    this.getWeekDays(this.currentOffset);
  }

  nextWeek(): void {
    this.currentOffset++
    this.getWeekDays(this.currentOffset);
  }

}
