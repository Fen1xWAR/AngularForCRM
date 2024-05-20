import {Component, EventEmitter, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {async, EMPTY} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(protected authService: AuthService) {
  }

  ngOnInit() {

  }


}
