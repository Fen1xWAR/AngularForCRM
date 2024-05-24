import { Component } from '@angular/core';
import {NgbActiveModal, NgbDate, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {Select2Module} from "ng-select2-component";
import {ScheduleService} from "../services/schedule.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-schedule-modal',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf,
    Select2Module,
    NgbInputDatepicker
  ],
  templateUrl: './schedule-modal.component.html',
  styleUrl: './schedule-modal.component.scss'
})
export class ScheduleModalComponent {
  private psychologistId? : string
  protected scheduleForm: FormGroup = new FormGroup({});
  protected current = new NgbDate(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate());
  constructor(protected activeModal: NgbActiveModal,private scheduleService: ScheduleService) {
    this.scheduleForm = new FormGroup({
      workDay : new FormControl(this.current, Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
    })
  }

  createSlot() {
    if(this.scheduleForm.valid) {
      const formData = this.scheduleForm.value
      this.scheduleService.createSchedule({
        psychologistId: this.psychologistId,
        workDay: `${formData.workDay.year}-${formData.workDay.month > 9 ? formData.workDay.month  : "0" + formData.workDay.month }-${formData.workDay.day > 9 ? formData.workDay.day : "0" + formData.workDay.day}`,
        startTime: formData.startTime + ':00',
        endTime: formData.endTime+':00',
        isBooked: false
      })
      this.activeModal.close()
      location.reload()
    }

  }
}
