import {Component} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserDataService} from "../services/user-data.service";
import {Visit, VisitService} from "../services/visit.service";
import {Contact, ContactService} from "../services/contact.service";
import {Client, ClientService} from "../services/client.service";
import {Service, ServiceService} from "../services/service.service";
import {Schedule, ScheduleService} from "../services/schedule.service";
import {Psychologist, PsychologistService} from "../services/psychologist.service";
import {BookingModalComponent} from "../bookingModal/booking-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormModalComponent} from "../form-modal/form-modal.component";


@Component({
  selector: 'app-psychologist-visits',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './psychologist-visits.component.html',
  styleUrl: './psychologist-visits.component.scss'
})
export class PsychologistVisitsComponent {
  protected visits: Visit[] = [];
  protected schedules: { [id: string]: Schedule } = {};
  protected services: { [id: string]: Service } = {};
  protected clientsContact: { [id: string]: Contact } = {};
  protected clients: { [id: string]: Client } = {};
  protected currentPsychologist?: Psychologist;
  protected currentDay: Date = new Date()


  constructor(protected contactService: ContactService, private modalService: NgbModal, private serviceService: ServiceService, private psychologistService: PsychologistService, private scheduleService: ScheduleService, private userDataService: UserDataService, private visitService: VisitService, private clientService: ClientService) {

  }

  ngOnInit(): void {
    this.userDataService.getUserData().subscribe(user => {
      if (user.userId != undefined)
        this.psychologistService.getPsychologistByUserId(user.userId).subscribe(psychologist => {
          this.currentPsychologist = psychologist;
          this.getVisits(this.currentDay)
        })

    })

  }


  UpdateVisit(visit: Visit) {
    this.visitService.updateVisit(visit);
  }

  getNextDay() {
    this.currentDay = new Date(this.currentDay.getTime() + 24 * 60 * 60 * 1000);
    this.getVisits(this.currentDay)
  }

  getPreviousDay() {
    this.currentDay = new Date(this.currentDay.getTime() - 24 * 60 * 60 * 1000);
    this.getVisits(this.currentDay)
    this.getVisits(this.currentDay)
  }

  private getVisits(date: Date): void {
    this.visits = []


    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateToUpload = date.getFullYear() + '-' + (month > 9 ? month : "0" + month) + '-' + (day > 9 ? day : "0" + day);

    if (this.currentPsychologist) {
      this.scheduleService.getByPsychologistIdAndDay(this.currentPsychologist.psychologistId, dateToUpload)
        .subscribe({
          next: schedules => {

            const visits: Visit[] = [];
            schedules.sort((a, b) => a.startTime > b.startTime ? 1 : -1);
            schedules.forEach(schedule => {
              console.log(schedule)
              if (schedule.isBooked) {
                this.schedules[schedule.scheduleId] = schedule;

                this.visitService.getVisitByScheduleId(schedule.scheduleId).subscribe({
                  next: visit => {
                    visits.push(visit);
                  },
                  complete: () => {
                    this.createClientsAndServicesDictionaries(visits);
                  }
                });
              }
            });
          }
        });
    }
  }

  private createClientsAndServicesDictionaries(visits: Visit[]): void {
    const clientsIds = [...new Set(visits.map(visit => visit.clientId))];
    const servicesIds = [...new Set(visits.map(visit => visit.serviceId))];

    clientsIds.forEach(id => {
      this.clientService.getClientById(id).subscribe(client => {
        this.clientService.getClientById(client.clientId).subscribe(currentProblem => {
          this.clients[id] = currentProblem;
        });

        this.contactService.getContactByUserId(client.userId).subscribe(contact => {
          this.clientsContact[id] = contact;
        });
      });
    });

    servicesIds.forEach(serviceId => {
      this.serviceService.getService(serviceId).subscribe(service => {
        this.services[serviceId] = service;
      });
    });

    this.visits = visits;
  }

  protected readonly JSON = JSON;
  protected readonly Object = Object;

  openModal(formId: string) {
    const modalRef = this.modalService.open(FormModalComponent, {
      modalDialogClass: 'modal-dialog-centered',
      size: 'md'
    });
    modalRef.componentInstance.formId = formId;
  }
}


