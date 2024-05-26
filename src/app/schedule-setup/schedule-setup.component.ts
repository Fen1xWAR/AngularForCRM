import {Component} from '@angular/core';
import {Schedule, ScheduleService} from "../services/schedule.service";
import {CalendarService} from "../services/calendar.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Psychologist, PsychologistService} from "../services/psychologist.service";
import {UserDataService} from "../services/user-data.service";
import {NgForm} from "@angular/forms";
import {EMPTY} from "rxjs";
import {FormModalComponent} from "../form-modal/form-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ScheduleModalComponent} from "../schedule-modal/schedule-modal.component";

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
  protected dates: Date[] = []
  protected slots: Schedule[] = [];
  private currentOffset = 0
  protected editableSlot?: Schedule
  protected selectedDate: Date = new Date()

  constructor(private scheduleService: ScheduleService, private modalService: NgbModal ,private calendarService: CalendarService, private psychologistService: PsychologistService, private userdataService: UserDataService) {
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

  getWeek() {
    this.dates = this.calendarService.getWeekDays(this.currentOffset)
    const now = new Date(Date.now());
    now.setMilliseconds(0)
    let selectedIndex = this.dates.findIndex(date => date >= now)
    if (selectedIndex >= 0) {
      this.selectedDate = this.dates[selectedIndex]
      this.getSlotsByDay(this.selectedDate)
    } else {
      this.slots = []
    }
  }

  previousWeek() {
    this.currentOffset--;
    this.getWeek()
  }

  nextWeek() {
    this.currentOffset++;
    this.getWeek()
  }

  getSlotsByDay(day: Date) {
    this.loadSlots(day).subscribe(slots => {
      this.selectedDate = day;
      this.slots = slots;

      this.slots.sort((a, b) => a.startTime > b.startTime ? 1 : -1)
    })

  }

  loadSlots(day: Date) {
    if (this.currentPsychologist?.userId) {
      const dataToUpload = `${day.getFullYear()}-${day.getMonth() > 8 ? day.getMonth() + 1 : "0" + (day.getMonth() + 1)}-${day.getDate() > 8 ? day.getDate() : "0" + day.getDate()}`;
      return this.scheduleService.getByPsychologistIdAndDay(this.currentPsychologist.psychologistId, dataToUpload)
    }
    return EMPTY
  }

  createSlot(){
    const modalRef = this.modalService.open(ScheduleModalComponent, {
      modalDialogClass: 'modal-dialog-centered',
      size: 'md'
    });
    modalRef.componentInstance.psychologistId = this.currentPsychologist?.psychologistId
  }
  editSlot(schedule: Schedule) {
    this.editableSlot = schedule
  }

  removeSlot(schedule: Schedule) {
    this.scheduleService.remove(schedule.scheduleId).subscribe(
      next => this.getSlotsByDay(this.selectedDate)
    )
  }

  saveSlot(schedule: Schedule) {
    const startTime = document.getElementById(`${schedule.scheduleId}-start`) as HTMLInputElement;
    const endTime = document.getElementById(`${schedule.scheduleId}-end`) as HTMLInputElement;
    if (startTime != null && endTime != null) {
      schedule.startTime = startTime.value + (startTime.value.split(':').length == 2 ? ":00" : "")
      schedule.endTime = endTime.value + (endTime.value.split(':').length == 2 ? ":00" : "")
      this.scheduleService.updateSchedule(schedule).subscribe();
      this.editableSlot = undefined;
    }
  }

  copyToNextWeek() {
    const currentWeek = this.dates
    const nextWeek = this.calendarService.getWeekDays(this.currentOffset + 1)
    for (let i = 0; i < nextWeek.length; i++) {
      const slots = this.loadSlots(currentWeek[i]).subscribe(slots=>{
        slots.forEach(slot => {
          this.scheduleService.createSchedule({
            psychologistId: slot.psychologistId,
            workDay: `${this.dates[i].getFullYear()}-${nextWeek[i].getMonth() > 9 ? nextWeek[i].getMonth() + 1 : "0" + (nextWeek[i].getMonth() + 1)}-${nextWeek[i].getDate() > 9 ? nextWeek[i].getDate() : "0" + nextWeek[i].getDate()}`,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false
          }).subscribe()
        })
      })
    }
  }

  copyToCurrentWeek() {
    const slots = this.slots
    const dates = this.calendarService.getWeekDays(this.currentOffset)
    for (let i = 0; i < dates.length; i++) {

      if (this.selectedDate != dates[i]) {

        slots.forEach((slot: Schedule) => {

          this.scheduleService.createSchedule({
            psychologistId: slot.psychologistId,
            workDay: `${this.dates[i].getFullYear()}-${dates[i].getMonth() > 9 ? dates[i].getMonth() + 1 : "0" + (dates[i].getMonth() + 1)}-${dates[i].getDate() > 9 ? dates[i].getDate() : "0" + dates[i].getDate()}`,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false
          }).subscribe()
        })
      }

    }
  }


}
