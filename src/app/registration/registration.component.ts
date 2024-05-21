import {Component} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {confirmPasswordValidator} from "../validators/confirm-password.validator";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: ['', [Validators.required]],
      confirmPassword: ['',[Validators.required]],
      role: ['', [Validators.required]],


    }, {validators: confirmPasswordValidator});
  }


  register() {
    if(this.registrationForm.valid){
      console.log(this.registrationForm.value);
      this.authService.register({
        email: this.registrationForm.value['email'],
        password: this.authService.encrypt(this.registrationForm.value['password']),
        role: this.registrationForm.value['role'],
      }).subscribe({
        next: tokens => {
          location.href = "/me";
        }
      })
    }
  }
}
