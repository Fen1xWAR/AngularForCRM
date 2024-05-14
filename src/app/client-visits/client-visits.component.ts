import {Component} from '@angular/core';
import {Contact, UserDataService, Visit} from "../services/user-data.service";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {Psychologist, Service, VisitService} from "../visit.service";
import {visit} from "@angular/compiler-cli/src/ngtsc/util/src/visitor";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-client-visits',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass,
    FormsModule
  ],
  templateUrl: './client-visits.component.html',
  styleUrl: './client-visits.component.scss'
})
export class ClientVisitsComponent {
  protected visits: Visit[] = [];
  protected services: { [id: string]: Service } = {};
  protected psychologists: { [id: string]: Contact } = {};

  constructor(private userDataService: UserDataService, private visitService: VisitService) {
  }

  ngOnInit(): void {
    this.userDataService.getUserVisits().subscribe(
      (visits: Visit[]) => {
        this.visits = visits;

        // Fetch all psychologists and their contacts
        const psychologistIds = [...new Set(visits.map(visit => visit.psychologistId))];
        psychologistIds.forEach(id => {
          this.visitService.getPsychologistById(id).subscribe(psychologist => {

            this.visitService.getPsychologistContactByUserId(psychologist.userId).subscribe(contact => {
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
}
