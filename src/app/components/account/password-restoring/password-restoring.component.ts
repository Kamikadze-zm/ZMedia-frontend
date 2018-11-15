import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { ReactiveFormComponent } from '../../util/components-util';
import { isInvalid, isValid, getErrors, markTouched, addValidationErrors } from 'src/app/util/forms-util';
import { Constants } from 'src/app/util/constants';
import { isVerificationCodeError, isValidationError, ValidationError } from 'src/app/model/error';

@Component({
  selector: 'app-password-restoring',
  templateUrl: './password-restoring.component.html',
  providers: [AccountService]
})
export class PasswordRestoringComponent implements OnInit, OnDestroy, ReactiveFormComponent {

  private code: string;
  private paramsSub: Subscription;

  passwordForm: FormGroup;

  success: boolean = false;
  error: string;

  constructor(private accountService: AccountService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.code = params['code'];
    });
    this.passwordForm = this.formBuilder.group({
      password: ['',
        [CustomValidators.required('Введите пароль'),
        CustomValidators.size(6, 20, 'Пароль должен содержать от 6 до 20 символов')]],
      confirmPassword: ['', CustomValidators.required('Подтвердите пароль')]
    }, { validator: CustomValidators.match('password', 'confirmPassword', 'Пароли не совпадают') });
  }

  restorePassword(): void {
    if (this.passwordForm.invalid) {
      this.markTouched();
      return;
    }

    this.accountService.restorePassword(this.code, this.passwordForm.value).subscribe(
      () => {
        this.success = true;
      },
      (err => {
        if (isVerificationCodeError(err)) {
          this.error = Constants.INVALID_VERIFICATION_CODE_MESSAGE;
        } else if (isValidationError(err)) {
          const ve: ValidationError = err.error as ValidationError;
          addValidationErrors(this.passwordForm, ve, false);
        } else {
          throw err;
        }
      }));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  isInvalid(path: string | (string | number)[]): boolean {
    return isInvalid(this.passwordForm, path);
  }

  isValid(path: string | (string | number)[]): boolean {
    return isValid(this.passwordForm, path);
  }

  getErrors(path: string | (string | number)[]): string[] {
    return getErrors(this.passwordForm, path);
  }

  markTouched() {
    markTouched(this.passwordForm);
  }
}