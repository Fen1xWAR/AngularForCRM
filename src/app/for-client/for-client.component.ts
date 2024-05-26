import { Component } from '@angular/core';

@Component({
  selector: 'app-for-client',
  standalone: true,
  imports: [],
  templateUrl: './for-client.component.html',
  styleUrl: './for-client.component.scss'
})
export class ForClientComponent {

    protected readonly location = location;
}
