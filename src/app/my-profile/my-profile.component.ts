import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {Contact, UserData, UserDataService} from "../user-data.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {LoadingService} from "../loading.service";
import {LoaderComponent} from "../loader/loader.component";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgIf,
    AsyncPipe,
    LoaderComponent,
    RouterLinkActive
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})

export class MyProfileComponent {
  UserData: UserData |undefined = undefined;
  UserContact : Contact | undefined = undefined;

  constructor(private UserDataService: UserDataService) {
  }

  ngOnInit() {
   this.UserDataService.getUserData().subscribe(data=> this.UserData = data);
   this.UserDataService.getUserContact().subscribe(data=> this.UserContact = data);
  }
}
