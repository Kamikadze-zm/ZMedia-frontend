import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ReactiveFormComponent, addError } from 'src/core/components/reactive-form-component';
import { AuthService } from 'src/core/services/auth.service';
import { SnackbarService } from 'src/core/services/snackbar.service';
import { CustomValidators, isEmptyValue } from 'src/validators/custom-validators';
import { UserCredentials } from 'src/core/model/user-credentials';
import { ValidationError } from 'src/core/model/error';
import { Messages } from '../messages';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  providers: [AccountService]
})
export class RegistrationComponent implements OnInit, ReactiveFormComponent {

  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [CustomValidators.required("Введите email"), CustomValidators.email()],
        [this.existEmailAsyncValidator.bind(this)]],
      name: ['',
        [CustomValidators.required("Введите имя пользователя"),
        CustomValidators.username(),
        CustomValidators.size(3, 64, "Имя пользователя должно содержать от 3 до 64 символов")],
        [this.existNameAsyncValidator.bind(this)]],
      password: ['',
        [CustomValidators.required("Введите пароль"),
        CustomValidators.size(6, 20, "Пароль должен содержать от 6 до 20 символов")]],
      confirmPassword: ['', CustomValidators.required("Подтвердите пароль")]
    }, { validator: this.passwordMatchValidator });
  }

  isInvalid(controlName: string): boolean {
    let control = this.registrationForm.controls[controlName];
    if (!control) {
      return false;
    }
    let invalid = control.touched && control.invalid;
    if (controlName === "password" || controlName === "confirmPassword") {
      let touched = this.registrationForm.controls["password"].touched && this.registrationForm.controls["confirmPassword"].touched;
      if (touched && this.registrationForm.getError("passwordConfirmed")) {
        invalid = true;
      }
    }
    return invalid;
  }

  isValid(controlName: string): boolean {
    let control = this.registrationForm.controls[controlName];
    if (!control) {
      return true;
    }
    return !this.isInvalid(controlName) && control.touched && !control.pending;
  }

  getErrors(controlName: string): string[] {
    let control = this.registrationForm.controls[controlName];
    if (!control) {
      return null;
    }
    let errors: string[] = [];
    if (control.errors) {
      for (let k in control.errors) {
        errors.push(control.errors[k]);
      }
    }
    if (controlName === "password" || controlName === "confirmPassword") {
      let touched = this.registrationForm.controls["password"].touched && this.registrationForm.controls["confirmPassword"].touched;
      let pe = this.registrationForm.getError("passwordConfirmed");
      if (touched && pe) {
        errors.push(pe);
      }
    }
    return errors;
  }

  register() {
    if (this.registrationForm.valid) {
      this.accountService.register(this.registrationForm.value).subscribe(
        () => {
          let login = this.registrationForm.controls["email"].value;
          let password = this.registrationForm.controls["password"].value;
          this.authService.login(new UserCredentials(login, password)).subscribe(
            (successfully: boolean) => {
              if (!successfully) {
                this.snackBar.show("Регистрация завершена. Не удалось выполнить вход");
              }
              this.router.navigate(['/']);
              this.snackBar.show(Messages.EMIAL_CONFIRMATION_SENDED_MESSAGE);
            }
          )
        },
        (err) => {
          if (err && err.status == 400) {
            if (err.error && err.error.errorCode == 1) {
              let ve: ValidationError = err.error as ValidationError;
              if (ve.fieldErrors) {
                ve.fieldErrors.forEach(e => {
                  addError(this.registrationForm.controls[e.field], "server", e.message);
                });
              }
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        });
    }
  }

  passwordMatchValidator(fg: FormGroup): ValidationErrors {
    return fg.controls['password'].value === fg.controls['confirmPassword'].value ? null : { passwordConfirmed: "Пароли не совпадают" };
  }

  existEmailAsyncValidator(control: AbstractControl): Observable<ValidationErrors> {
    const value = control.value;
    if (isEmptyValue(value)) {
      return null;
    }
    return timer(500).pipe(
      switchMap(() => {
        return this.accountService.existEmail(value).pipe(
          map((exist: boolean) => (exist ? { emailExist: "Email уже зарегистрирован" } : null))
        );
      }))
  }

  existNameAsyncValidator(control: AbstractControl): Observable<ValidationErrors> {
    const value = control.value;
    if (isEmptyValue(value)) {
      return null;
    }
    return timer(500).pipe(
      switchMap(() => {
        return this.accountService.existName(value).pipe(
          map((exist: boolean) => (exist ? { nameExist: "Имя пользователя уже занято" } : null))
        );
      }))
  }
}