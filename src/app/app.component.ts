import { Component } from '@angular/core';

import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {LoaderComponent} from "./loader/loader.component";
import {LoaderService} from "./services/loader.service";
import {RouterOutlet} from "@angular/router";
import {ToastAlertsComponent} from "./toast-alerts/toast-alerts.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsyncPipe, LoaderComponent, NgIf, NgClass, ToastAlertsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(protected loaderService: LoaderService) {}

}
