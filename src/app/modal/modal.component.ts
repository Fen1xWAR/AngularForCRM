import {Component} from '@angular/core';
import {Schedule, ScheduleService,} from "../services/schedule.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, KeyValuePipe, NgForOf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PsychologistFullData} from "../services/psychologist.service";
import {Service, ServiceService} from "../services/service.service";
import {Visit, VisitService} from "../services/visit.service";


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe,
    FormsModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  slot?: Schedule;
  psychologist?: PsychologistFullData;
  protected selectedService?: Service;
  services: { [id: string]: Service } = {};
  protected readonly Object = Object;
  visitCreationForm: FormGroup = new FormGroup({});

  constructor(public activeModal: NgbActiveModal, private serviceRepository: ServiceService, private scheduleService: ScheduleService, private visitService: VisitService) {

  }

  ngOnInit() {
    if (this.psychologist?.psychologistId) {
      this.visitCreationForm = new FormGroup({
        clientDescription: new FormControl('')
      });
      this.serviceRepository.getServicesByPsychologistId(this.psychologist?.psychologistId).subscribe(services => {
        services.sort((a: Service, b: Service) => a.serviceName.localeCompare(b.serviceName));
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
    console.log("!!!")
    if (this.slot) {
      this.scheduleService.getById(this.slot.scheduleId).subscribe(schedule =>{
        if(schedule.visitId != undefined){
          console.error("ALREADY BOOKED!")
          return
        }
        const visit : Partial<Visit> = {
            clientId : "9fbfd5a9-45fc-4281-ad2d-593af3a87bfc",
            dateTime : this.slot?.workDay,
            clientNote : this.visitCreationForm.value[0],
            serviceId : this.selectedService?.serviceId,
            psychologistId : this.psychologist?.psychologistId
        }

        this.visitService.createVisit(visit).subscribe(visitId=> {
          if(this.slot){

            this.slot.visitId = visitId
            this.scheduleService.updateSchedule(this.slot).subscribe();
          }

        });
        }
      )
    }
  }


}
