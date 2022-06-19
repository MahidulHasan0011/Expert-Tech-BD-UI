import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.scss']
})
export class NewLoginComponent implements OnInit {

  public formData: FormGroup;

  constructor(
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmitForm() {
    if (this.formData.invalid) {
      this.username.markAsTouched({onlySelf: true});
      this.password.markAsTouched({onlySelf: true});
      return;
    }
    this.spinner.show();
    this.userService.userLogin(this.formData.value);
  }

  /**
   * Form Validations
   */
  get username() {
    return this.formData.get('username');
  }

  get password() {
    return this.formData.get('password');
  }

}
