import {Component} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserDataService} from "../services/user-data.service";
import {Visit, VisitService} from "../services/visit.service";
import {Contact, ContactService} from "../services/contact.service";
import {Client, ClientService} from "../services/client.service";
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
  protected clientsContact: { [id: string]: Contact } = {};
  protected clients: { [id: string]: Client } = {};
  protected age?: Contact;


  constructor(protected contactService: ContactService, private userDataService: UserDataService, private visitService: VisitService, private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.userDataService.getUserVisits().subscribe(
      (visits: Visit[]) => {
        this.visits = visits;


        const clientsIds = [...new Set(visits.map(visit => visit.clientId))];
        clientsIds.forEach(id => {
          this.clientService.getClientById(id).subscribe(client => {
            this.clientService.getClientById(client.clientId).subscribe(currentProblem => {
              this.clients[id] = currentProblem;
            })

            this.contactService.getContactByUserId(client.userId).subscribe(contact => {
              this.clientsContact[id] = contact;
            });
          });
        });
        const services = [...new Set(visits.map(visit => visit.serviceId))];
        services.forEach(serviceId => {
          this.visitService.getService(serviceId).subscribe(service => {
            this.services[serviceId] = service;
          })
        })
      }
    );

  }


  UpdateVisit(visit: Visit) {
    this.visitService.updateVisit(visit);
  }

}


