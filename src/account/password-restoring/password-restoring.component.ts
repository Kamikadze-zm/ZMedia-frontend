import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BaseReactiveFormComponent } from 'src/core/components/reactive-form-component';
import { isVerificationCodeError, isValidationError, ValidationError } from 'src/core/model/error';
import { CustomValidators } from 'src/validators/custom-validators';
import { Messages } from '../messages';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-password-restoring',
  templateUrl: './password-restoring.component.html',
  providers: [AccountService]
})
export class PasswordRestoringComponent extends BaseReactiveFormComponent implements OnInit, OnDestroy {

  private code: string;
  private paramsSub: Subscription;

  passwordForm: FormGroup;

  success: boolean = false;
  error: string;

  constructor(private accountService: AccountService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
    super();
  }

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
    super.setForm(this.passwordForm);
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
          this.error = Messages.INVALID_VERIFICATION_CODE_MESSAGE;
        } else if (isValidationError(err)) {
          const ve: ValidationError = err.error as ValidationError;
          this.addValidationErrors(ve, false);
        } else {
          throw err;
        }
      }));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}