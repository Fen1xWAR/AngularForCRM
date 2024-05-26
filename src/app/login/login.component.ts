
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, Form, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {hide} from "@popperjs/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  hidePassword: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
  }
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', [Validators.required])
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        tokens => {
          location.href = "/me";

        },
        error => {
          console.error(error);
        }
      );
    }
  }

  protected readonly hide = hide;
}
