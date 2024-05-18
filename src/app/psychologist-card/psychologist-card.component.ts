import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PsychologistFullData} from "../services/psychologist.service";



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

  sliceDescription(desc : string | undefined): string {
    if(desc != undefined){
      return  desc.length >300? desc.substring(0, 300) + "...":desc;
    }
  return ''
  }
}
