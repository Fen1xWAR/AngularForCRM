import { Component } from '@angular/core';
import {UserDataService, Visit} from "../services/user-data.service";
import {DatePipe, NgClass, NgForOf} from "@angular/common";


@Component({
  selector: 'app-client-visits',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass
  ],
  templateUrl: './client-visits.component.html',
  styleUrl: './client-visits.component.scss'
})
export class ClientVisitsComponent {
    protected visits: Visit[] = [];

    constructor(private userDataService: UserDataService) {
    }
    ngOnInit(){
      this.userDataService.getUserVisits().subscribe(visits=> this.visits = visits);
    }

}
