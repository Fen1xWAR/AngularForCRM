import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from "../services/Toast/toast-service";

@Component({
  selector: 'app-toast-alerts',
  templateUrl: './toast-alerts.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgbToast,
    NgIf,
    NgTemplateOutlet
  ],
  styleUrls: ['./toast-alerts.component.css']
})
export class ToastAlertsComponent {
  alerts: { type: string, message: string }[] = [];

  constructor(protected toastService: ToastService) { }
  isTemplate(toast : any) { return toast.textOrTpl instanceof TemplateRef; }

}
