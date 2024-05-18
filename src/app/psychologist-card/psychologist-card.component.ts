import {Component, Input} from '@angular/core';
import {PsychologistFullData} from "../psychologists/psychologists.component";
import {RouterLink} from "@angular/router";



@Component({
  selector: 'app-psychologist-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './psychologist-card.component.html',
  styleUrl: './psychologist-card.component.scss'
})
export class PsychologistCardComponent {
  @Input() psychologist: PsychologistFullData | undefined;
}
