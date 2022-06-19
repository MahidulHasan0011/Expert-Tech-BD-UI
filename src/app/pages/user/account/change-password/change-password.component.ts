import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {UiService} from '../../../../services/ui.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  // For Reset
  @ViewChild('formDirective') formDirective: NgForm;

  public formData: FormGroup;


  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required]
    });
  }


  onSubmitForm() {
    if (this.formData.invalid) {
      return;
    }

    this.editPassword();
  }


  private editPassword() {
    console.log(this.formData.value);
    // this.userService.updatePassword(data)
    //   .subscribe(res => {
    //     this.uiService.success(res.message);
    //     this.formDirective.resetForm();
    //     // this.router.navigate(['/dashboard']);
    //   }, error => {
    //     console.log(error);
    //   });
  }


}
