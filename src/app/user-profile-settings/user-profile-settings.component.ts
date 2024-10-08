import {Component, Injectable} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgIf} from "@angular/common";
import {UserData, UserDataService, UserFull} from "../services/user-data.service";
import {config, EMPTY, Observable, switchMap, tap, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Contact, ContactService} from "../services/contact.service";
import {AuthService} from "../services/auth.service";
import {MyProfileComponent} from "../my-profile/my-profile.component";
import {Select2Data, Select2Module} from "ng-select2-component";
import {Client, ClientService} from "../services/client.service";
import {Psychologist, PsychologistService} from "../services/psychologist.service";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDateStruct,
  NgbInputDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import {clientsProblemVariants} from "../variables";

class UserTemplate {
  userDataFull: UserFull;
  contact: Contact;
  clientOrPsychologist: Client | Psychologist;

  constructor(userDataFull: UserFull, contact: Contact, clientOrPsychologist: Client | Psychologist) {
    this.clientOrPsychologist = clientOrPsychologist;
    this.userDataFull = userDataFull;
    this.contact = contact;
  }
}

@Component({
  selector: 'app-my-form',
  templateUrl: './user-profile-settings.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    Select2Module,
    NgbInputDatepicker
  ],
  styleUrls: ['./user-profile-settings.component.scss']
})
export class UserProfileSettingsComponent {
  protected userDataFull: UserFull | null = null;

  currentRoleObj: Client | Psychologist | null = null;
  userContact: Contact | null = null;
  settingsForm: FormGroup = new FormGroup({});
  protected current = new Date()

  constructor(private userdataService: UserDataService, private config: NgbDatepickerConfig, private profile: MyProfileComponent, private contactService: ContactService, private authService: AuthService, private clientService: ClientService, private psychologistService: PsychologistService) {

  }


  ngOnInit(): void {


    this.formCreate();
    this.loadUserData();
  }


  loadUserData(): void {
    this.userdataService.getUserData().pipe(
      switchMap((userData: UserData) => {
        if (userData.userId !== undefined) {
          return this.loadFullUserInfo(userData.userId);
        }
        return EMPTY;
      })
    ).subscribe(userData => {
      this.initForm(new UserTemplate(userData.userDataFull, userData.contact, userData.clientOrPsychologist));
    })
  }

  private loadFullUserInfo(userId: string) {
    return this.userdataService.loadFullUserInfo(userId).pipe(
      switchMap((userDataFull: UserFull) => {
        return this.contactService.loadContactById(userDataFull.contactId).pipe(
          switchMap((contact: Contact) => {

            if (userDataFull.role === 'Client') {
              return this.clientService.getClientByUserId(userDataFull.userId).pipe(
                map((client: Client) => ({userDataFull, contact, clientOrPsychologist: client}))
              );
            } else if (userDataFull.role === 'Psychologist') {
              return this.psychologistService.getPsychologistByUserId(userDataFull.userId).pipe(
                map((psychologist: Psychologist) => ({userDataFull, contact, clientOrPsychologist: psychologist}))
              );
            } else {
              return throwError(new Error('Invalid user role'));
            }
          })
        );
      })
    );
  }


  initForm(userData: UserTemplate): void {
    this.userDataFull = userData.userDataFull;
    this.userContact = userData.contact;
    this.currentRoleObj = userData.clientOrPsychologist;
    const currentDateOfBirthData = new Date(this.userContact.dateOfBirth);
    const currentDateOfBirthObj = new NgbDate(currentDateOfBirthData.getFullYear(), currentDateOfBirthData.getMonth() + 1, currentDateOfBirthData.getDate());
    let currentProblem: [] = [];


    if (this.userDataFull.role === 'Client') {
      const client = this.currentRoleObj as Client;
      try {
        currentProblem = JSON.parse(client.currentProblem);
      } catch (error) {
        currentProblem = []
      }


    }
    let about: string = ''
    if (this.userDataFull.role === 'Psychologist') {

      const psychologist = this.currentRoleObj as Psychologist;
      about = psychologist.about;

    }
    this.settingsForm.patchValue({
      name: userData.contact.name ?? '',
      lastname: userData.contact.lastname ?? '',
      middleName: userData.contact.middlename ?? '',
      phoneNumber: userData.contact.phoneNumber ?? '',
      dateOfBirth: currentDateOfBirthObj,
      email: userData.userDataFull.email ?? '',
      currentProblem: currentProblem,
      about: about
    });
  }

  uploadForm(): void {
    const formData = this.settingsForm.value;
    const user: Partial<UserFull> = {
      userId: this.userDataFull?.userId,
      email: formData.email,
      password: formData.password != "" ? this.authService.encrypt(formData.password) : this.userDataFull?.password,
      role: this.userDataFull?.role,
      contactId: this.userDataFull?.contactId,
    }
    const contact: Partial<Contact> = {
      contactId: this.userDataFull?.contactId,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: `${formData.dateOfBirth.year}-${formData.dateOfBirth.month > 9 ? formData.dateOfBirth.month : "0" + formData.dateOfBirth.month}-${formData.dateOfBirth.day > 9 ? formData.dateOfBirth.day : "0" + formData.dateOfBirth.day}`,
      name: formData.name,
      lastname: formData.lastname,
      middlename: formData.middleName
    }
    if (this.currentRoleObj != null) {
      if (this.userDataFull?.role === 'Client') {
        const currentObj = this.currentRoleObj as Client;
        currentObj.currentProblem = JSON.stringify(formData.currentProblem);
        this.clientService.updateClient(currentObj).subscribe((response) => {
        });

      } else if (this.userDataFull?.role === 'Psychologist') {
        const currentObj = this.currentRoleObj as Psychologist;
        currentObj.about = formData.about;
        this.psychologistService.updatePsychologist(currentObj).subscribe((response) => {
          },
          (error) => {
          });
      } else throw Error("Сюда дойти не должно было!")
    }
    this.contactService.updateContact(contact).subscribe((response) => {

        this.profile.ngOnInit()
      },
    )
    this.userdataService.updateUser(user).subscribe();

  }

  formCreate(): void {
    this.settingsForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern("^[A-zА-яЁё]+$")]),
      lastname: new FormControl('', [Validators.required, Validators.pattern("^[A-zА-яЁё]+$")]),
      middleName: new FormControl('', Validators.pattern("^[A-zА-яЁё]+$")),
      dateOfBirth: new FormControl([Validators.required]),
      phoneNumber: new FormControl('', [Validators.pattern('^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('',),
      currentProblem: new FormControl(''),
      about: new FormControl('')

    });
  }

  protected readonly clientsProblemVariants = clientsProblemVariants;
}
