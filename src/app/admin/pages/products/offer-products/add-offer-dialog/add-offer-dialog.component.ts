import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FormBuilderController} from '../../common/filter-form-builder/filter-form-builder.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ShopService} from "../../../../../services/shop.service";
import {UiService} from "../../../../../services/ui.service";
import {OfferProduct} from "../../../../../interfaces/offer-product";


@Component({
  selector: 'app-category-dialog',
  templateUrl: './add-offer-dialog.component.html',
  styleUrls: ['./add-offer-dialog.component.scss']
})
export class AddOfferDialogComponent implements OnInit {

  private sub: Subscription;
  dataForm: FormGroup;

  autoSlug = true;
  isLoading = false;
  needCategoryEdit = false;

  // tagName
  // taSlug

  tag = new FormControl(null, {validators: [Validators.required]});
  priorityNumber = new FormControl(null, {validators: [Validators.required]});

  tagList = [
    {tagName: 'New Arrival', tagSlug: 'new-arrival'},
    {tagName: 'Flash Sale', tagSlug: 'flash-sale'},
  ]
  // Reset
  @ViewChild('formDirective') formDirective: NgForm;

  // Filter Form Builder Control
  formControllers: FormBuilderController[] = [
    {disable: false}
  ];
  filterFormData: any[] = [];


  constructor(
    private shopService: ShopService,
    private uiService: UiService,
    public dialogRef: MatDialogRef<AddOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      tag: this.tag,
      priorityNumber: this.priorityNumber,
    });

    console.log(this.data.productId)

  }

  /**
   * ON SUBMIT
   */


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete required field');
      return;
    }

    const finalData: OfferProduct = {
      _id: null,
      priorityNumber: this.dataForm.value.priorityNumber,
      tagName: this.dataForm.value.tag.tagName,
      tagSlug: this.dataForm.value.tag.tagSlug,
      product: this.data.productId
    }

    this.addOfferProduct(finalData);
  }


  /**
   * HTTP REQ HANDLE
   */

  private addOfferProduct(data: OfferProduct) {
    this.isLoading = true;
    this.shopService.addOfferProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.dialogRef.close();
        this.isLoading = false;
        this.resetForm();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }


  /**
   * Form Reset
   */

  private resetForm() {
    this.formDirective.resetForm();
  }

}
