import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FormBuilderController} from '../../common/filter-form-builder/filter-form-builder.component';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from "../../../../../services/product.service";
import {UiService} from "../../../../../services/ui.service";
import {ReloadService} from "../../../../../services/reload.service";
import {Category} from "../../../../../interfaces/category";
import {ConfirmDialogComponent} from "../../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-category-dialog',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  private sub: Subscription;
  dataForm: FormGroup;

  autoSlug = true;
  isLoading = false;
  needCategoryEdit = false;

  categoryName = new FormControl(null, {validators: [Validators.required]});
  slug = new FormControl(null, {validators: [Validators.required]});
  min = new FormControl(null, {validators: [Validators.required]});
  max = new FormControl(null, {validators: [Validators.required]});

  // Reset
  @ViewChild('formDirective') formDirective: NgForm;

  // Filter Form Builder Control
  formControllers: FormBuilderController[] = [
    {disable: false}
  ];
  filterFormData: any[] = [];


  constructor(
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      categoryName: this.categoryName,
      slug: this.slug,
      min: this.min,
      max: this.max,
    });
    this.autoGenerateSlug();

  }

  /**
   * ON SUBMIT
   */

  // private setFormValue() {
  //   this.needCategoryEdit = true;
  //   this.dataForm.patchValue({
  //     categoryName: this.data.category.categoryName,
  //     slug: this.data.category.slug
  //   });
  // }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete required field');
      return;
    }

    // if (this.filterFormData.length === 0) {
    //   this.uiService.warn('No Filter Data Added!');
    //   this.confirmation();
    //   return;
    // }


    this.addNewCategory();

    // if (!this.needCategoryEdit) {
    //   this.addNewCategory();
    // } else {
    //   const updateData = {...{_id: this.data.category._id}, ...this.dataForm.value};
    //   this.editCategory(updateData);
    // }
  }

  /**
   * ON Filter Form Builder Action
   */
  onF(data: any, i: number) {
    this.formControllers[i].disable = true;
    this.formControllers.push({disable: false});
    const mData = {...data, ...{key: this.convertToObjKey(data.title)}};
    this.filterFormData.push(mData);
  }

  removeFilter(i: number) {
    this.filterFormData.splice(i, 1);
    this.formControllers.splice(i, 1);
    console.log(this.filterFormData);
  }


  /**
   * LOGICAL PART
   */
  autoGenerateSlug() {
    // console.log(this.dataForm.get('categoryName'));
    // if (this.dataForm.get('categoryName').value === null) {
    //   return;
    // }
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('categoryName').valueChanges
        .pipe(
        ).subscribe(d => {
          const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  convertToObjKey(str: string) {
    const strModify = str.trim().toLowerCase();
    return strModify.replace(/\s+/g, '_');
  }

  /**
   * HTTP REQ HANDLE
   */

  private addNewCategory() {
    this.isLoading = true;
    const finalData = {
      categoryName: this.dataForm.value.categoryName,
      slug: this.dataForm.value.slug,
      priceRange: {
        min: this.dataForm.value.min,
        max: this.dataForm.value.max
      },
      filters: this.filterFormData
    };
    this.productService.addNewCategory(finalData)
      .subscribe(res => {
        this.uiService.success(res.message);
        // this.reloadService.needRefreshCat$();
        this.isLoading = false;
        this.resetForm();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  private editCategory(updateData: Category) {
    this.isLoading = true;
    this.productService.editCategory(updateData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCat$();
        this.isLoading = false;
        // this.dialogRef.close();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  /**
   * DIALOG AREA
   * Form Reset
   */

  public confirmation() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '800px',
      minHeight: '150px',
      data: {
        title: 'Confirm Without Filter Data !',
        message: 'Are you sure you want confirm without filter data?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.addNewCategory();
      }
    });
  }

  private resetForm() {
    this.formDirective.resetForm();
    this.filterFormData = [];
    this.formControllers = [{disable: false}];
    // this.autoGenerateSlug();
  }

}
