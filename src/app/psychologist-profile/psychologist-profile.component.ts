import {Component} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {Psychologist, PsychologistFullData, PsychologistService} from "../services/psychologist.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {back, router} from "ngx-bootstrap-icons";
import {Title} from "@angular/platform-browser";
import {ContactService} from "../services/contact.service";

import {map} from "rxjs/operators";
import {ScheduleComponent} from "../schedule/schedule.component";

@Component({
  selector: 'app-psychologist-profile',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    ScheduleComponent,
    AsyncPipe,
  ],
  templateUrl: './psychologist-profile.component.html',
  styleUrl: './psychologist-profile.component.scss'
})
export class PsychologistProfileComponent {

  protected psychologistId: string | undefined = '';
  protected psychologist: PsychologistFullData | undefined = undefined
  protected isLoggedIn: boolean = false;
  protected isRecordPanelOpen: boolean = false;

  constructor(private route: ActivatedRoute, private contactService: ContactService, protected authService: AuthService, private titleService: Title, private psychologistService: PsychologistService) {
    this.isLoggedIn = this.authService.getJwtToken() != null;
  }

  ngOnInit() {
    this.psychologistId = this.route.snapshot.params['id'];
    if (this.psychologistId != undefined) {
      this.psychologistService.getPsychologistById(this.psychologistId).subscribe(
        psychologist => {
          this.contactService.getContactByUserId(psychologist.userId).subscribe(
            contact => {
              this.psychologist = {
                psychologistId: this.psychologistId ?? "",
                name: contact.name,
                lastName: contact.lastname,
                middlename: contact.middlename,
                about: psychologist.about,
                age: this.contactService.calculateAge(contact.dateOfBirth as Date),
              }
            }
          )
        }
      )


    }


  }

  toggleRecordPanel(): void {
    this.isRecordPanelOpen = !this.isRecordPanelOpen;
  }


  protected readonly back = back;
  protected readonly window = window;
}
