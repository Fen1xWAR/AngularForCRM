import {Component} from '@angular/core';
import {UserData, UserDataService} from "../services/user-data.service";
import {Client, ClientService} from "../services/client.service";
import {FormService} from "../services/form.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Form} from "../services/form.service";
import {NgClass, NgIf} from "@angular/common";
import {switchMap} from "rxjs";


export interface FormContent {
  q1: string;
  q2: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  protected userForm: Form | undefined = undefined;

  protected userFormContent: FormContent | undefined = undefined;
  protected formGroup: FormGroup = new FormGroup({});
  protected showForm: boolean = false;

  constructor(private userDataService: UserDataService, private clientService: ClientService, private formService: FormService) {
  }

  updateForm(formId: string | undefined, formContent: string) {
    if (this.formGroup.valid && formId !== undefined) {
      this.formService.updateForm({"formId": formId, "formContent": JSON.stringify(formContent)}).pipe(
        switchMap(() => this.formService.getFormById(formId))
      ).subscribe(form => {
        if (form != undefined) {
          this.userForm = form;
          try {
            this.userFormContent = JSON.parse(this.userForm?.formContent);
          }
          catch{
            this.userFormContent = undefined;
          }
          if (this.userFormContent)
            this.formGroup.patchValue(this.userFormContent);
        }

      });
      this.showForm = false;
      ;
      this.showForm = false;

    }
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      q1: new FormControl('', Validators.required),
      q2: new FormControl('', Validators.required)
    });
    this.userDataService.getUserData().subscribe(
      (userData: UserData) => {
        if (userData.userId) {
          this.clientService.getClientByUserId(userData.userId).subscribe(
            (client: Client) => {
              this.formService.getFormById(client.formId).subscribe(form => {


                  this.userForm = form;
                try {
                  this.userFormContent = JSON.parse(this.userForm?.formContent);
                }
                catch{
                  this.userFormContent = undefined;
                }
                }
              )
            }
          );
        }
      },
      (error: any) => {
        console.error('Error fetching form:', error);
      }
    );

  }
}
