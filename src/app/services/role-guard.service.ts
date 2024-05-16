import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, retry} from 'rxjs';
import {UserDataService} from "./user-data.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  private currentRole: string | undefined = undefined;

  constructor(private router: Router, private userDataService: UserDataService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = next.data['expectedRole'];

    this.userDataService.getUserData().subscribe(userData => {
      this.currentRole = userData.role;
      if (this.currentRole != expectedRole) {

        this.router.navigate(['/me']);
      }
    });


    return true;
  }
}
