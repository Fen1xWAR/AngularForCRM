import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {UserData, UserDataService} from "../user-data.service";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})

export class MyProfileComponent {
  UserData: UserData | null = null;
  name: string = "Test"

  constructor(private UserDataService: UserDataService) {
  }

  ngOnInit() {
    this.UserDataService.getUserData().subscribe(
      data => {
        this.UserData = data;
      },
      error => console.log(error.error.errorMesage)
    )
  }
}
