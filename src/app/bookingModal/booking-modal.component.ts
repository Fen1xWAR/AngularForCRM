import {Component} from '@angular/core';
import {Schedule, ScheduleService,} from "../services/schedule.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, KeyValuePipe, NgForOf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PsychologistFullData} from "../services/psychologist.service";
import {Service, ServiceService} from "../services/service.service";
import {Visit, VisitService} from "../services/visit.service";
import {UserDataService} from "../services/user-data.service";
import {ClientService} from "../services/client.service";
import {catchError} from "rxjs/operators";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {switchMap} from "rxjs";
import {ToastService} from "../services/Toast/toast-service";


@Component({
  selector: 'app-bookingModal',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe,
    FormsModule
  ],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss'
})
export class BookingModalComponent {
  slot?: Schedule;
  psychologist?: PsychologistFullData;
  protected selectedService?: Service;
  services: { [id: string]: Service } = {};
  protected readonly Object = Object;
  visitCreationForm: FormGroup = new FormGroup({});

  constructor(public activeModal: NgbActiveModal, private clientService: ClientService, private toastService: ToastService, private userDataService: UserDataService, private serviceRepository: ServiceService, private scheduleService: ScheduleService, private visitService: VisitService) {

  }

  ngOnInit() {
    if (this.psychologist?.psychologistId) {
      this.visitCreationForm = new FormGroup({
        clientDescription: new FormControl('')
      });
      this.serviceRepository.getServicesByPsychologistId(this.psychologist?.psychologistId).subscribe(services => {
        services.sort((a: Service, b: Service) => a.servicePrice > b.servicePrice ? 1 : -1);
        services.forEach(service => {
          this.services[service.serviceId] = service;
        })

        this.selectedService = Object.values(this.services)[0]


      });

    }
  }

  onServiceSelectChange(event: Event) {
    this.selectedService = this.services[(event.target as HTMLSelectElement).value];
  }

  createVisit() {
    if (!this.slot) {
      return;
    }

    this.scheduleService.getById(this.slot.scheduleId)
      .pipe(
        switchMap(schedule => {
          if (schedule.isBooked) {
            this.toastService.show('Выбранное время уже заронированно', {classname: 'bg-danger text-light'})
          }
          return this.userDataService.getUserData();
        }),
        switchMap(userData => {
          if (!userData.userId) {
            throw new Error();
          }
          return this.clientService.getClientByUserId(userData.userId);
        }),
        switchMap(client => {
          const visit: Partial<Visit> = {
            clientId: client.clientId,
            scheduleId: this.slot?.scheduleId,
            clientNote: this.visitCreationForm.value.clientDescription,
            serviceId: this.selectedService?.serviceId,
            psychologistId: this.psychologist?.psychologistId
          };

          return this.visitService.createVisit(visit).pipe(
            switchMap(visitId => {
              if (this.slot) {
                this.slot.isBooked = true;
                return this.scheduleService.updateSchedule(this.slot);
              }
              throw new Error();
            })
          );
        })
      )
      .subscribe(
        () => {
          this.toastService.show('Запись успешно выполнена', {classname: 'bg-success text-light'});
          this.activeModal.close();
        },
      );
  }


}
