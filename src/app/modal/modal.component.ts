import { Component } from '@angular/core';
import {Schedule,} from "../services/schedule.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
export interface  Service{
  label : string;
  value : string;
}
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
    slot : Schedule | undefined = undefined;
    protected selectedService: Service | undefined = undefined
    services : Service[]  = [{label : "Первая услуга ", value : "3000"},{label : "Вторая услуга ", value : "9000"}];
  constructor(public activeModal: NgbActiveModal) {
    this.selectedService = this.services[0]
  }

  selectChange(){
    // this.selectedService = value
  }
}
