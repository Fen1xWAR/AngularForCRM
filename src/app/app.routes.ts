import {Routes} from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {VisitsComponent} from "./visits/visits.component";
import {FormComponent} from "./form/form.component";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'me', component: MyProfileComponent, children: [
      { path: '', redirectTo: 'visits', pathMatch: 'full' },
      {path: 'visits', component: VisitsComponent},
      {path: 'form', component: FormComponent}
    ]
  },

];
