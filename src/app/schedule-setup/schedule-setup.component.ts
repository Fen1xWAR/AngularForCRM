import {Component} from '@angular/core';
import {Schedule, ScheduleService} from "../services/schedule.service";
import {CalendarService} from "../services/calendar.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Psychologist, PsychologistService} from "../services/psychologist.service";
import {UserDataService} from "../services/user-data.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-schedule-setup',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './schedule-setup.component.html',
  styleUrl: './schedule-setup.component.scss'
})
export class ScheduleSetupComponent {
  protected currentPsychologist?: Psychologist
  protected currentDate = new Date();
  protected dates: any[] = []
  protected slots: Schedule[] = [];
  private currentOffset = 0
  protected editableSlot?: Schedule
  protected selectedDate: Date = new Date()

  constructor(private scheduleService: ScheduleService, private calendarService: CalendarService, private psychologistService: PsychologistService, private userdataService: UserDataService) {
  }

  ngOnInit() {
    this.userdataService.getUserData().subscribe(
      user => {
        if (user.userId)
          this.psychologistService.getPsychologistByUserId(user.userId).subscribe(
            psychologist => {
              this.currentPsychologist = psychologist;
              this.dates = this.calendarService.getWeekDays(this.currentOffset)
              this.getSlotsByDay(this.currentDate)
            }
          )
      }
    )

  }

  previousWeek() {
    this.currentOffset--;
    this.dates = this.calendarService.getWeekDays(this.currentOffset)
  }

  nextWeek() {
    this.currentOffset++;
    this.dates = this.calendarService.getWeekDays(this.currentOffset)
  }

  getSlotsByDay(day: Date) {
    if (this.currentPsychologist?.userId) {
      this.selectedDate = day
      const dataToUpload = `${day.getFullYear()}-${day.getMonth() > 9 ? day.getMonth() + 1 : "0" + (day.getMonth() + 1)}-${day.getDate() > 9 ? day.getDate() : "0" + day.getDay()}`;
      this.scheduleService.getByPsychologistIdAndDay(this.currentPsychologist.psychologistId, dataToUpload).subscribe(
        slots => {
          console.log(slots)
          this.slots = slots
        }
      )
    }
  }


  editSlot(schedule: Schedule) {
    this.editableSlot = schedule
    console.log('edit slot ' + schedule.scheduleId)
  }

  removeSlot(schedule: Schedule) {
    console.log('remove slot ' + schedule.scheduleId)
  }

  saveSlot(schedule: Schedule) {
    const startTime = document.getElementById(`${schedule.scheduleId}-start`) as HTMLInputElement;
    const endTime = document.getElementById(`${schedule.scheduleId}-end`) as HTMLInputElement;
    if (startTime != null && endTime != null) {
      schedule.startTime = startTime.value + (startTime.value.split(':').length == 2 ? ":00" : "")
      schedule.endTime = endTime.value + (endTime.value.split(':').length == 2 ? ":00" : "")
      this.scheduleService.updateSchedule(schedule).subscribe();
      this.editableSlot = undefined;
      console.log('save slot ' + schedule.scheduleId)
    }
    ;
  }
}
