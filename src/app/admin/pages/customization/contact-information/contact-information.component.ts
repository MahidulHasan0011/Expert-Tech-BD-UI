import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { FormBuilderController } from '../../products/common/filter-form-builder/filter-form-builder.component';
import {ContactInfo} from "../../../../interfaces/contact-info";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss']
})
export class ContactInformationComponent implements OnInit {

  contactInfoData: ContactInfo = null;
  // addressLines: string[] = [];
  oldAddressLines: string[] = [];
  addressLines: object[] = [];
  newAddressLines: string[] = [];
  dataForm: FormGroup;
  isLoading = false;

  _id = new FormControl(null);
  primaryPhoneNo = new FormControl(null, {validators: [Validators.required]});
  secondaryPhoneNo = new FormControl(null);
  addressLineOne = new FormControl(null, {validators: [Validators.required]});
  addressLineTwo = new FormControl(null);
  email = new FormControl(null, {validators: [Validators.email, Validators.required]});
  facebookLink = new FormControl(null);
  youtubeLink = new FormControl(null);
  instagramLink = new FormControl(null);
  twitterLink = new FormControl(null);
  shopOpenTime = new FormControl(null, {validators: [Validators.required]});
  notification = new FormControl(null);

  // Filter Form Builder Control
  formControllers: FormBuilderController[] = [
    {disable: false}
  ];
  filterFormData: any[] = [];

  constructor(
    private shopService: ShopService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    this.reloadService.refreshContactInfo$.subscribe(() => {
      this.getContactInfo();
    })

    this.getContactInfo();

    this.dataForm = new FormGroup({
      _id: this._id,
      primaryPhoneNo: this.primaryPhoneNo,
      secondaryPhoneNo: this.secondaryPhoneNo,
      addressLineOne: this.addressLineOne,
      addressLineTwo: this.addressLineTwo,
      email: this.email,
      facebookLink: this.facebookLink,
      youtubeLink: this.youtubeLink,
      instagramLink: this.instagramLink,
      twitterLink: this.twitterLink,
      shopOpenTime: this.shopOpenTime,
      notification: this.notification,
    });

  }

  public addAddress(){
    // const data = "";
    const data = {key: ""};
    this.addressLines.push(data);
  }

  public removeAddress(index:number){
    this.addressLines.splice(index, 1);
  }

  public finalAddressData() {
    this.newAddressLines = this.addressLines.map(function(addressLine){ return addressLine['key']});
    console.log(this.newAddressLines);

  }

  /**
   * ON SUBMIT
   */

  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Save',
        message: 'Are you sure you want save this changes?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.setContactInfo();
      }
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.contactInfoData);
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    this.finalAddressData();

    this.setContactInfo();

  }

  /**
   * HTTP REQ HANDLE
   */

  private getContactInfo() {
    this.shopService.getContactInfo()
      .subscribe(res => {
        this.contactInfoData = res.data;
        if (this.contactInfoData !== null && this.contactInfoData !== undefined) {
          this.oldAddressLines = this.contactInfoData.addressLines;
          this.addressLines = this.oldAddressLines.map(key => ({ key }));
          console.log(this.addressLines);
          this.setFormValue();
        }
      }, error => {
        console.log(error);
      });
  }

  private setContactInfo() {
    this.isLoading = true;
    console.log({...this.dataForm.value, ...{addressLines: this.newAddressLines}});
    this.shopService.setContactInfo({...this.dataForm.value, ...{addressLines: this.newAddressLines}})
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshContactInfo$();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }


}
