import {Routes} from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {FormComponent} from "./form/form.component";
import {VisitsComponent} from "./visits/visits.component";
import {RoleGuardService} from "./services/role-guard.service";
import {ClientsComponent} from "./clients/clients.component";

import {Component404} from "./404/404.component";
import {UserProfileSettingsComponent} from "./user-profile-settings/user-profile-settings.component";
import {ServerErrorComponent} from "./server-error/server-error.component";
import {PsychologistsComponent} from "./psychologists/psychologists.component";
import {PsychologistProfileComponent} from "./psychologist-profile/psychologist-profile.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {ScheduleSetupComponent} from "./schedule-setup/schedule-setup.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, title: "Главная"},
  {path: 'about', component: AboutComponent, title: 'О нас',},
  {path: 'login', component: LoginComponent, title: "Войти"},
  {path: 'register', component: RegistrationComponent, title : "Регистрация"},
  {
    path: 'me',
    title: "Мой профиль",
    component: MyProfileComponent,
    children: [
      {path: '', redirectTo: 'visits', pathMatch: 'full'},
      {path: 'visits', component: VisitsComponent},
      {path: 'form', component: FormComponent, canActivate: [RoleGuardService], data: {expectedRole: "Client"}},
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [RoleGuardService],
        data: {expectedRole: "Psychologist"}
      },
      {path: 'schedule', component: ScheduleSetupComponent, canActivate: [RoleGuardService],data: {expectedRole: "Psychologist"}},
      {path: "settings", component: UserProfileSettingsComponent}

    ]
  },
  {
    path: 'forclient', component: PsychologistsComponent,
    title: "Клиентам",
  },
  {
    path: 'psychologist/:id', component: PsychologistProfileComponent,
  },
  {
    path: 'error', component: ServerErrorComponent,
    title: "Ошибка",
  },
  {path: "**", component: Component404,
    title: "404 страница не найдена ",}

];
