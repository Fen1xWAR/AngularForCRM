import {Component} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserDataService} from "../services/user-data.service";
import {Visit, VisitService} from "../services/visit.service";
import {Contact, ContactService} from "../services/contact.service";
import {Client, ClientService} from "../services/client.service";
import {Service} from "../services/service.service";
import {Schedule, ScheduleService} from "../services/schedule.service";
import {Psychologist, PsychologistFullData, PsychologistService} from "../services/psychologist.service";


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
  protected currentPsychologist?: Psychologist;
  protected age?: Contact;


  constructor(protected contactService: ContactService, private psychologistService: PsychologistService, private scheduleService: ScheduleService, private userDataService: UserDataService, private visitService: VisitService, private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.userDataService.getUserData().subscribe(user => {
      if (user.userId != undefined)
        this.psychologistService.getPsychologistByUserId(user.userId).subscribe(psychologist => {
          this.currentPsychologist = psychologist;
          this.getVisits(new Date())
        })

    })
    // this.userDataService.getUserVisits().subscribe(
    //   (visits: Visit[]) => {
    //     this.visits = visits;
    //
    //
    //     const clientsIds = [...new Set(visits.map(visit => visit.clientId))];
    //     clientsIds.forEach(id => {
    //       this.clientService.getClientById(id).subscribe(client => {
    //         this.clientService.getClientById(client.clientId).subscribe(currentProblem => {
    //           this.clients[id] = currentProblem;
    //         })
    //
    //         this.contactService.getContactByUserId(client.userId).subscribe(contact => {
    //           this.clientsContact[id] = contact;
    //         });
    //       });
    //     });
    //     const services = [...new Set(visits.map(visit => visit.serviceId))];
    //     services.forEach(serviceId => {
    //       this.visitService.getService(serviceId).subscribe(service => {
    //         this.services[serviceId] = service;
    //       })
    //     })
    //   }
    // );

  }


  UpdateVisit(visit: Visit) {
    this.visitService.updateVisit(visit);
  }


  getVisits(date: Date): void {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateToUpload = date.getFullYear() + '-' + (month > 9 ? month : "0" + month) + '-' + (day > 9 ? day : "0" + day);

    if (this.currentPsychologist) {
      const visits : Visit[] = []
      this.scheduleService.getByPsychologistIdAndDay(this.currentPsychologist.psychologistId, dateToUpload)
        .subscribe({
          next: schedules => {

            schedules.sort((a, b) => a.startTime > b.startTime ? 1 : -1);
            schedules.map(schedule => {
              if (schedule.visitId)
                this.visitService.getVisitById(schedule.visitId).subscribe({
                    next: visit => {
                      visits.push(visit);
                    },
                    complete:()=>{
                      const clientsIds = [...new Set(this.visits.map(visit => visit.clientId))];
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
                      const services = [...new Set(this.visits.map(visit => visit.serviceId))];
                      services.forEach(serviceId => {
                              this.visitService.getService(serviceId).subscribe(service => {
                                this.services[serviceId] = service;
                              })
                            })
                      this.visits = visits;
                    }
                  }
                )
            })
          }

        })

    }
  }

  protected readonly JSON = JSON;
}


