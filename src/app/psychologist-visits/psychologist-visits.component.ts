import { Component } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserDataService} from "../services/user-data.service";
import {Visit, VisitService} from "../services/visit.service";
import {Contact, ContactService} from "../services/contact.service";
import {PsychologistService} from "../services/psychologist.service";
import {ClientService} from "../services/client.service";
import {Service} from "../services/service.service";

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
  protected services: { [id: string]: Service } = {};
  protected clients: { [id: string]: Contact } = {};


constructor(protected contactRepository : ContactService, private userDataService: UserDataService, private visitService: VisitService, private clientService: ClientService) {
}

ngOnInit(): void {
  this.userDataService.getUserVisits().subscribe(
    (visits: Visit[]) => {
      this.visits = visits;

      // Fetch all psychologists and their contacts
      const clientsIds = [...new Set(visits.map(visit => visit.clientId))];
      clientsIds.forEach(id => {
        this.clientService.getClientById(id).subscribe(client => {

          this.contactRepository.getContactByUserId(client.userId).subscribe(contact => {
            this.clients[id] = contact;
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
}


