import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Branch} from 'src/app/interfaces/branch';
import {ReloadService} from 'src/app/services/reload.service';
import {ShopService} from 'src/app/services/shop.service';
import {UiService} from 'src/app/services/ui.service';
import {UserDataService} from 'src/app/services/user-data.service';

@Component({
  selector: 'app-add-new-branch',
  templateUrl: './add-new-branch.component.html',
  styleUrls: ['./add-new-branch.component.scss']
})
export class AddNewBranchComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private shopService: ShopService,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private uiService: UiService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<AddNewBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      primaryPhoneNo: [null, Validators.required],
      secondaryPhoneNo: null,
      addressLineOne: [null, Validators.required],
      addressLineTwo: null,
      email: null,
      shopOpenTime: [null, Validators.required],
      notification: null,
      type: null,
      priority: null
    });

    if (this.data) {
      this.setFormData();
      console.log(this.data._id);
    }
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  private setFormData() {
    this.form.patchValue(this.data);
  }

  /**
   * ON SUBMIT FORM
   */

  onSubmitBranch() {
    const finalData: Branch = {
      primaryPhoneNo: this.form.value.primaryPhoneNo,
      secondaryPhoneNo: this.form.value.secondaryPhoneNo,
      addressLineOne: this.form.value.addressLineOne,
      addressLineTwo: this.form.value.addressLineTwo,
      email: this.form.value.email,
      shopOpenTime: this.form.value.shopOpenTime,
      notification: this.form.value.notification,
      type: this.form.value.type,
      priority: this.form.value.priority,
    };

    if (this.data) {
      finalData._id = this.data._id;
    }

    console.log(finalData);
    this.setBranchInfo(finalData);

    // if (this.form.invalid) {
    //   return;
    // } else if (this.data) {
    //   this.setBranchInfo(finalData);
    //   console.log(finalData);
    // }

  }

  setBranchInfo(data: Branch) {
    this.shopService.setBranchInfo(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshBranch$();
        this.dialogRef.close();
        // this.matDialog.closeAll();
      }, error => {
        console.log(error);
      });
  }

}
