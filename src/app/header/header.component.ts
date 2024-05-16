import {Component, EventEmitter, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NgIf} from '@angular/common';
import {EMPTY} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  protected isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.refreshTokens() == EMPTY ? (this.isLoggedIn = false) : (this.isLoggedIn = true);
    console.log(this.isLoggedIn);

  }

  logout(): void {
    this.authService.logout();
    this.ngOnInit()
  }
}
