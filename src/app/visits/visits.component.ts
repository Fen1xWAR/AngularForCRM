import {Component, Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {UserDataService} from "../user-data.service";
import {ClientVisitsComponent} from "../client-visits/client-visits.component";
import {NgIf} from "@angular/common";
import {PsychologistVisitsComponent} from "../psychologist-visits/psychologist-visits.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [
    ClientVisitsComponent,
    NgIf,
    PsychologistVisitsComponent
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss'
})
@Injectable()
export class VisitsComponent {
  protected role: string | undefined;
  constructor(private userDataService: UserDataService) {}
  ngOnInit() {

   this.userDataService.getUserData()?.subscribe(data=>this.role = data.role );
  }
}
