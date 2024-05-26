import {Component, Input, input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {UserData, UserDataService} from "../services/user-data.service";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../loader/loader.component";
import {AuthService} from "../services/auth.service";

import {Contact, ContactService} from "../services/contact.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {Select2Module} from "ng-select2-component";
import {clientsProblemVariants} from "../variables";
import {Client, ClientService} from "../services/client.service";
import {Psychologist, PsychologistService} from "../services/psychologist.service";

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
    NgForOf,
    ReactiveFormsModule,
    NgbInputDatepicker,
    Select2Module
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})

export class MyProfileComponent {
  UserData: UserData | undefined = undefined;
  UserContact: Contact | undefined = undefined;
  protected current = new Date()
  protected startForm : FormGroup = new FormGroup({})

  constructor(private router: Router, private userDataService: UserDataService, private authService: AuthService, private contactService: ContactService, private clientService: ClientService, private psychologistService: PsychologistService) {
  }

  isActive(path: string) {
    return this.router.url.includes(path);
  }

  ngOnInit() {
    this.userDataService.getUserData().subscribe(data => {
      if(data == undefined){
        location.href='/'
      }
      this.UserData = data });

    this.userDataService.getUserContact().subscribe(data => this.UserContact = data);
    this.startForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern("^[A-zА-яЁё]+$")]),
      lastname: new FormControl('', [Validators.required, Validators.pattern("^[A-zА-яЁё]+$")]),
      middleName: new FormControl('', Validators.pattern("^[A-zА-яЁё]+$")),
      dateOfBirth: new FormControl([Validators.required]),
      phoneNumber: new FormControl('', [Validators.pattern('^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')]),
      currentProblem: new FormControl(''),
      about: new FormControl('')

    })
  }

  upload() {

    const formData = this.startForm.value;
    const contact: Partial<Contact> = {
      contactId: this.UserContact?.contactId,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: `${formData.dateOfBirth.year}-${formData.dateOfBirth.month > 9 ? formData.dateOfBirth.month : "0" + formData.dateOfBirth.month}-${formData.dateOfBirth.day > 9 ? formData.dateOfBirth.day : "0" + formData.dateOfBirth.day}`,
      name: formData.name,
      lastname: formData.lastname,
      middlename: formData.middleName
    }
    if (this.UserData?.userId != undefined) {
      if (this?.UserData?.role === 'Client') {
        this.clientService.getClientByUserId(this.UserData.userId).subscribe(data => {
          data.currentProblem = JSON.stringify(formData.currentProblem);
          this.clientService.updateClient(data).subscribe((response) => {

          });
        })


      } else if (this?.UserData?.role === 'Psychologist') {
        this.psychologistService.getPsychologistByUserId(this.UserData.userId).subscribe(data => {
          data.about = formData.about;
          this.psychologistService.updatePsychologist(data).subscribe((response) => {
          });
        })

      } else throw Error("Сюда дойти не должно было!")
      this.contactService.updateContact(contact).subscribe((response) => {
        if(this?.UserData?.role === 'Client'){
          location.href="/me/form"
        }
        else{

          location.reload()
        }
      })
    }


  }

  logout() {
    this.authService.logout()

  }

  protected readonly clientsProblemVariants = clientsProblemVariants;
}
