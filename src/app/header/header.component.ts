import {Component, EventEmitter, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {async, EMPTY} from 'rxjs';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  IsBg :boolean = false
  constructor(protected authService: AuthService,protected router: Router) {

  }

  ngOnInit() {

  }
  toggleBg(){
    this.IsBg = !this.IsBg;
  }

}
