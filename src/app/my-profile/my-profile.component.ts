import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import { UserData, UserDataService} from "../services/user-data.service";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../loader/loader.component";
import {AuthService} from "../services/auth.service";

import {Contact} from "../services/contact.service";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgIf,
    AsyncPipe,
    LoaderComponent,
    RouterLinkActive,
    NgClass,
    NgForOf
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})

export class MyProfileComponent {
  UserData: UserData | undefined = undefined;
  UserContact: Contact | undefined = undefined;

  constructor(private router: Router, private userDataService: UserDataService, private authService: AuthService) {
  }

  isActive(path: string) {
    return this.router.url.includes(path);
  }

  ngOnInit() {
    this.userDataService.getUserData().subscribe(data => this.UserData = data);
    this.userDataService.getUserContact().subscribe(data => this.UserContact = data);
  }

  logout() {
  this.authService.logout()


  }
}
