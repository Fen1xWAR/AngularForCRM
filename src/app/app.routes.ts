import {Routes} from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {FormComponent} from "./form/form.component";
import {PsychologistVisitsComponent} from "./psychologist-visits/psychologist-visits.component";
import {VisitsComponent} from "./visits/visits.component";
import {ClientVisitsComponent} from "./client-visits/client-visits.component";
import {RoleGuardService} from "./role-guard.service";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'me',
    component: MyProfileComponent,
    children: [
      {path: '', redirectTo: 'visits', pathMatch: 'full'},
      {path: 'visits', component: VisitsComponent,},
      {path: 'form', component: FormComponent, canActivate: [RoleGuardService],data: {expectedRole: "Client"}},
      {path: 'clients',component: ClientVisitsComponent,canActivate: [RoleGuardService], data : {expectedRole : "Psychologist"}}
    ]
  }

];
