import {Component} from '@angular/core';
import {PsychologistCardComponent} from "../psychologist-card/psychologist-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {Psychologist, PsychologistFullData, PsychologistService} from "../services/psychologist.service";
import {Contact, ContactService} from "../services/contact.service";
import {findIndex, forkJoin} from 'rxjs';
import {map} from "rxjs/operators";


@Component({
  selector: 'app-psychologists',
  standalone: true,
  imports: [
    PsychologistCardComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './psychologists.component.html',
  styleUrl: './psychologists.component.scss'
})
export class PsychologistsComponent {
  psychologists: PsychologistFullData[] = [];
  protected pageSize = 10;
  protected currentPage = 1;
  protected haseNextPage = true;

  constructor(private psychologistService: PsychologistService, private contactService: ContactService,) {
  }


  ngOnInit() {
    this.loadPsychologists()
  }

  loadPsychologists(): void {
    console.log("getting list")
    const newPsychologists: PsychologistFullData[] = [];
    this.psychologistService.getPsychologists(this.currentPage, this.pageSize).subscribe({
      next: (psychologists: Psychologist[]) => {
        const contactRequests = psychologists.map(psychologist =>
          this.contactService.getContactByUserId(psychologist.userId).pipe(
            map(contact => ({
              psychologistId: psychologist.psychologistId, // get psychologistId here
              name: contact.name,
              lastName: contact.lastname,
              middlename: contact.middlename,
              about: psychologist.about,
              age: this.contactService.calculateAge(contact.dateOfBirth),
            }))
          )
        );

        forkJoin(contactRequests).subscribe({
          next: (contacts: PsychologistFullData[]) => {
            newPsychologists.push(...contacts);
            this.psychologists = [...this.psychologists, ...newPsychologists];
            console.log("complete psychologists", this.psychologists);
            this.haseNextPage = newPsychologists.length === this.pageSize
          }
        });
      }
    });
  }
  loadMore(): void{
    if(this.haseNextPage){
      this.currentPage++;
      this.loadPsychologists();
    }
  }
}
