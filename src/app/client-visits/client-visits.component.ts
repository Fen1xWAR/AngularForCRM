import {Component} from '@angular/core';
import {UserDataService} from "../services/user-data.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Visit, VisitService} from "../services/visit.service";
import {PsychologistService} from "../services/psychologist.service";
import {Contact, ContactService} from "../services/contact.service";
import {Service} from "../services/service.service";


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

  constructor(protected contactService: ContactService, private userDataService: UserDataService, private visitService: VisitService, private psychologistService: PsychologistService) {
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
          this.visitService.getService(serviceId).subscribe(service => {
            this.services[serviceId] = service;
          })
        })
      },
      (error: any) => {
        console.error('Error fetching visits:', error);
      }
    );

  }


  UpdateVisit(visit: Visit) {
    this.visitService.updateVisit(visit);
  }

  protected readonly Date = Date;
  protected readonly location = location;
}
