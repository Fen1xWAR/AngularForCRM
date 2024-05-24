import {Component} from '@angular/core';
import {UserDataService} from "../services/user-data.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Visit, VisitService} from "../services/visit.service";
import {PsychologistService} from "../services/psychologist.service";
import {Contact, ContactService} from "../services/contact.service";
import {Service, ServiceService} from "../services/service.service";
import {Schedule, ScheduleService} from "../services/schedule.service";


@Component({
  selector: 'app-client-visits',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass,
    FormsModule,
    NgIf
  ],
  templateUrl: './client-visits.component.html',
  styleUrl: './client-visits.component.scss'
})
export class ClientVisitsComponent {
  protected visits: Visit[] = [];
  protected services: { [id: string]: Service } = {};
  protected psychologists: { [id: string]: Contact } = {};
  protected schedules : {[id: string]: Schedule } = {};

  constructor(protected contactService: ContactService, private scheduleService : ScheduleService, private serviceService: ServiceService, private userDataService: UserDataService, private visitService: VisitService, private psychologistService: PsychologistService) {
  }

  ngOnInit(): void {
    this.userDataService.getUserVisits().subscribe(
      (visits: Visit[]) => {
        this.visits = visits;

        const psychologistIds = [...new Set(visits.map(visit => visit.psychologistId))];
        psychologistIds.forEach(id => {
          this.psychologistService.getPsychologistById(id).subscribe(psychologist => {

            this.contactService.getContactByUserId(psychologist.userId).subscribe(contact => {
              this.psychologists[id] = contact;
            });
          });
        });
        const services = [...new Set(visits.map(visit => visit.serviceId))];
        services.forEach(serviceId => {
          this.serviceService.getService(serviceId).subscribe(service => {
            this.services[serviceId] = service;
          })
        })

        visits.forEach(visit => {
          this.scheduleService.getById(visit.scheduleId).subscribe(schedule => {
                this.schedules[schedule.scheduleId] = schedule;
          })

        })

      },
      (error: any) => {
      },
      ()=>{
        this.visits.sort((a, b) => {
          let aStartTime = this.schedules[a.scheduleId]?.workDay;
          let bStartTime = this.schedules[b.scheduleId]?.workDay;
          aStartTime = aStartTime as Date
          bStartTime = bStartTime as Date
          return aStartTime?.getDate()  > bStartTime?.getDate() ? -1: 1;
        });
      }
    );

  }


  UpdateVisit(visit: Visit) {
    this.visitService.updateVisit(visit);
  }

  protected readonly Date = Date;
  protected readonly location = location;
}
