import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {FormBuilderController} from '../../common/filter-form-builder/filter-form-builder.component';
import {MatDialog} from '@angular/material/dialog';
import {Category} from "../../../../../interfaces/category";
import {ProductService} from "../../../../../services/product.service";
import {UiService} from "../../../../../services/ui.service";
import {ReloadService} from "../../../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-publisher-dialog',
  templateUrl: './sub-category-dialog.component.html',
  styleUrls: ['./sub-category-dialog.component.scss']
})
export class SubCategoryDialogComponent implements OnInit {

  private sub: Subscription;
  dataForm: FormGroup;

  categories: Category[] = [];

  autoSlug = true;
  isLoading = false;


  parentCategory = new FormControl(null, {validators: [Validators.required]});
  subCatName = new FormControl(null, {validators: [Validators.required]});
  slug = new FormControl(null, {validators: [Validators.required]});
  min = new FormControl(null, {validators: [Validators.required]});
  max = new FormControl(null, {validators: [Validators.required]});

  // Reset
  @ViewChild('formDirective') formDirective: NgForm;

  public filteredCatList: Category[];

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

    this.getBasicCategoryList();

    this.dataForm = new FormGroup({
      parentCategory: this.parentCategory,
      subCatName: this.subCatName,
      slug: this.slug,
      min: this.min,
      max: this.max,
    });

    this.autoGenerateSlug();

  }

  /**
   * ON SUBMIT
   */


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete required field');
      return;
    }

    if (this.filterFormData.length === 0) {
      this.uiService.warn('No Filter Data Added!');
      this.confirmation();
      return;
    }

    this.addNewSubCategory();
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
        this.addNewSubCategory();
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getBasicCategoryList() {
    this.productService.getCategoryBasicList()
      .subscribe(res => {
        this.categories = res.data;
        this.filteredCatList = this.categories.slice();
      }, error => {
        console.log(error);
      });
  }


  /**
   * LOGICAL PART
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('subCatName').valueChanges
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

  // private addNewSubCategory() {
  //   this.isLoading = true;
  //   this.productService.addNewSubCategory(this.dataForm.value)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshPublisher$();
  //       this.isLoading = false;
  //     }, error => {
  //       this.isLoading = false;
  //       console.log(error);
  //     });
  // }

  private addNewSubCategory() {
    this.isLoading = true;
    const finalData = {
      subCatName: this.dataForm.value.subCatName,
      parentCategory: this.dataForm.value.parentCategory._id,
      parentCategoryName: this.dataForm.value.parentCategory.categoryName,
      slug: this.dataForm.value.slug,
      priceRange: {
        min: this.dataForm.value.min,
        max: this.dataForm.value.max
      },
      filters: this.filterFormData
    };
    this.productService.addNewSubCategory(finalData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.isLoading = false;
        this.resetForm();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }


  private resetForm() {
    this.formDirective.resetForm();
    this.filterFormData = [];
    this.formControllers = [{disable: false}];
    // this.autoGenerateSlug();
  }

  // private editSubCategory(updateData: SubCategory) {
  //   this.isLoading = true;
  //   this.productService.editSubCategory(updateData)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshPublisher$();
  //       this.isLoading = false;
  //       this.dialogRef.close();
  //     }, error => {
  //       this.isLoading = false;
  //       console.log(error);
  //     });
  // }

}
