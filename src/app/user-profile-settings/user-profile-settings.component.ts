import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgIf} from "@angular/common";
import { UserData, UserDataService, UserFull} from "../services/user-data.service";
import {EMPTY, Observable, switchMap, tap, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Contact, ContactService} from "../services/contact.service";
import {AuthService} from "../services/auth.service";
import {MyProfileComponent} from "../my-profile/my-profile.component";
import {Select2Data, Select2Module} from "ng-select2-component";
import {Client, ClientService} from "../services/client.service";
import {Psychologist, PsychologistService} from "../services/psychologist.service";

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
    Select2Module
  ],
  styleUrls: ['./user-profile-settings.component.scss']
})
export class UserProfileSettingsComponent {
  protected userDataFull: UserFull | null = null;
  data: Select2Data = [
    {
      value: 'Я огурец',
      label: 'Я огурец',
    },
    {
      value: 'Я банан',
      label: 'Я банан',
    },
    {
      value: 'Я еблан',
      label: 'Я еблан',
    },
  ];
  currentRoleObj: Client | Psychologist | null = null;
  userContact: Contact | null = null;
  settingsForm: FormGroup = new FormGroup({});

  constructor(private userdataService: UserDataService, private profile: MyProfileComponent, private contactService: ContactService, private authService: AuthService, private clientService: ClientService, private psychologistService: PsychologistService) {
  }

  ngOnInit(): void {
    this.formCreate();
    this.loadUserData();
  }


  loadUserData(): void {
    this.userdataService.getUserData().pipe(
      tap(() => console.log('Loading user data')),
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
    let currentProblem : [] = [];
    if(this.userDataFull.role === 'Client') {
      const client = this.currentRoleObj as Client;
      try{
        currentProblem  = JSON.parse(<string>client.currentProblem);
      }
        catch(error){
        currentProblem = []
        }


    }
    this.settingsForm.patchValue({
      name: userData.contact.name ?? '',
      lastname: userData.contact.lastname ?? '',
      phoneNumber: userData.contact.phoneNumber ?? '',
      email: userData.userDataFull.email ?? '',
      currentProblem: currentProblem,
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
      name: formData.name,
      lastname: formData.lastname,
      middlename: ""
    }
    if (this.currentRoleObj != null) {
      if (this.userDataFull?.role === 'Client') {
        const currentObj = this.currentRoleObj as Client;
        currentObj.currentProblem = JSON.stringify(formData.currentProblem);
        this.clientService.updateClient(currentObj).subscribe((response) => {
            console.log("Client updated successfully");
          },
          (error) => {
            console.error("Error updating client")
          });

      } else if (this.userDataFull?.role === 'Psychologist') {
        const currentObj = this.currentRoleObj as Psychologist;
        // currentObj = JSON.parse(formData.currentProblem);
        this.psychologistService.updatePsychologist(currentObj).subscribe((response) => {
            console.log("Psychologist updated successfully");
          },
          (error) => {
            console.error("Error updating psychologist")
          });
      }
      else throw Error("Сюда дойти не должно было!")
    }
    this.contactService.updateContact(contact).subscribe((response) => {
        console.log('Contact updated successfully', response);
        this.profile.ngOnInit()
      },
      (error) => {
        console.error('Error updating user data', error.errorMessage);
      })
    this.userdataService.updateUser(user).subscribe(
      (response) => {
        console.log('RoleBased data updated successfully', response);
      },
      (error) => {
        console.error('Error updating roleBasedData data', error.errorMessage);
      }
    );

    this.userdataService.updateUser(user).subscribe(
      (response) => {
        console.log('User data updated successfully', response);
      },
      (error) => {
        console.error('Error updating user data', error.errorMessage);
      }
    );
  }

  formCreate(): void {
    this.settingsForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern("^[A-zА-яЁё]+$")]),
      lastname: new FormControl('', [Validators.required, Validators.pattern("^[A-zА-яЁё]+$")]),
      phoneNumber: new FormControl('', [Validators.pattern('^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      currentProblem: new FormControl(''),

    });
  }
}
