import {Component, Input, input} from '@angular/core';
import {DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UserData} from "../services/user-data.service";
import {Schedule, ScheduleService} from "../services/schedule.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from "../modal/modal.component";
import {PsychologistFullData} from "../services/psychologist.service";

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
  @Input() psychologist: PsychologistFullData | undefined = undefined;
  dates: Date[] = []
  slots: Schedule[] = [];
  protected selectedDate: Date = new Date()
  protected currentDate: Date = new Date(Date.now())
  protected currentOffset = 0

  constructor(private scheduleService: ScheduleService, private modalService: NgbModal) {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getWeekDays(0)
      this.selectedDate = new Date(Date.now());
      this.getDaySlots(this.selectedDate);
    }, 0)

  }

  openModal(slot: Schedule): void {
    const modalRef = this.modalService.open(ModalComponent, {
      backdrop: "static",
      modalDialogClass: 'modal-dialog-centered',
      size: 'lg'
    });
    modalRef.componentInstance.slot = slot;
  }

  selectScheduleDay(day: Date) {
    this.selectedDate = day;
    this.getDaySlots(day)

  }

  getDaySlots(date: Date) {

    if (this.psychologist?.psychologistId != null) {
      console.log("GettingSlots")
      const month: number = date.getMonth() + 1
      const day: number = date.getDate();
      const dateToUpload = date.getFullYear() + '-' + (month > 9 ? month : "0" + month) + '-' + (day > 9 ? day : "0" + day);
      this.scheduleService.getByPsychologistIdAndDay(this.psychologist.psychologistId, dateToUpload).subscribe(schedules => {
          this.slots = schedules;
          this.slots.sort((a, b) => a.startTime > b.startTime ? 1 : -1)
        }
      )
    }
  }


  getWeekDays(weekOffset: number): void {
    const currentDate = new Date(Date.now());

    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1) + 7 * weekOffset;
    const monday = new Date(currentDate.setDate(diff));
    this.dates = [];
    for (let i = 0; i < 7; i++) {

      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      this.dates.push(day)
    }

    const now = new Date(Date.now());
    now.setMilliseconds(0)
    let selectedIndex = this.dates.findIndex(date => date >= now)
    if (selectedIndex >= 0) {
      this.selectedDate = this.dates[selectedIndex]
      this.getDaySlots(this.selectedDate)
    } else {
      this.slots = []
    }


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
