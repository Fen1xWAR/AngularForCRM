import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-psychologist-profile',
  standalone: true,
  imports: [],
  templateUrl: './psychologist-profile.component.html',
  styleUrl: './psychologist-profile.component.scss'
})
export class PsychologistProfileComponent {

  protected id : string | null = '';
  constructor(private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
