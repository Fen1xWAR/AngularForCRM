import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormService} from "../services/form.service";
import {KeyValuePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe
  ],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.scss'
})
export class FormModalComponent {
  formId?: string
  formContent : {[key: string]: string} = {}
  constructor(protected activeModal: NgbActiveModal,private formService: FormService) {
  }

  ngOnInit(){
    if(this.formId)
    this.formService.getFormById(this.formId).subscribe(form => {
      this.formContent = JSON.parse(form.formContent)
    })
  }
}
