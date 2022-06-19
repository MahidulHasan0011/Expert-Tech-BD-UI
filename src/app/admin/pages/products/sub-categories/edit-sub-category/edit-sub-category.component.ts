import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {SubCategory} from "../../../../../interfaces/sub-category";
import {Category} from "../../../../../interfaces/category";
import {ProductService} from "../../../../../services/product.service";
import {UiService} from "../../../../../services/ui.service";
import {ReloadService} from "../../../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


export interface SubCatFilter {
  components: object[];
  title: string;
  key: string;

}

@Component({
  selector: 'app-publisher-dialog',
  templateUrl: './edit-sub-category.component.html',
  styleUrls: ['./edit-sub-category.component.scss']
})
export class EditSubCategoryComponent implements OnInit {

  private sub: Subscription;
  subCatId: string = null;
  suCategory: SubCategory = null;
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

  filters: SubCatFilter[] = [];


  constructor(
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.subCatId = param.get('id');
      this.getASingleSubCategoryById();
    })


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
   * SET FORM DATA
   */

  private setFormValue() {
    this.dataForm.patchValue({
      // parentCategory: this.suCategory.parentCategory,
      subCatName: this.suCategory.subCatName,
      slug: this.suCategory.slug,
      min: this.suCategory.priceRange.min,
      max: this.suCategory.priceRange.max
    });
  }


  /**
   * ON SUBMIT
   */


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete required field');
      return;
    }

    this.addNewSubCategory();
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
        this.dataForm.patchValue({
          parentCategory: this.filteredCatList.find(f => f._id === this.suCategory.parentCategory)
        });
      }, error => {
        console.log(error);
      });
  }

  getASingleSubCategoryById() {
    this.productService.getASingleSubCategoryById(this.subCatId)
      .subscribe(res => {
        this.suCategory = res.data;
        this.filters = res.data.filters;
        this.getBasicCategoryList();
        this.setFormValue();
        console.log(this.filters);
      })
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
      _id: this.subCatId,
      subCatName: this.dataForm.value.subCatName,
      parentCategory: this.dataForm.value.parentCategory._id,
      parentCategoryName: this.dataForm.value.parentCategory.categoryName,
      slug: this.dataForm.value.slug,
      priceRange: {
        min: this.dataForm.value.min,
        max: this.dataForm.value.max
      },
      filters: this.finalFilterData()
    };

    this.productService.editSubCategory(finalData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.isLoading = false;
        // this.resetForm();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });

  }


  private resetForm() {
    this.formDirective.resetForm();
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

  /**
   * REMOVE FILTER AREA
   */
  removeComponentKey(filterIndex: number, comIndex: number) {
    const filterArray = this.filters[filterIndex];
    filterArray.components.splice(comIndex, 1)

  }

  addComponentKey(filterIndex: number) {
    const data = {
      key: ''
    }
    this.filters[filterIndex].components.push(data);
  }


  removeSingleFilter(filterIndex: number) {
    this.filters.splice(filterIndex, 1)
  }

  onAddFilter() {
    const f: SubCatFilter = {
      components: [{
        key: ''
      }],
      title: '',
      key: ''
    }
    this.filters.push(f);



  }

  finalFilterData(): SubCatFilter[] {
    return this.filters.map(m => {
      return {...m, ...{key: this.convertToObjKey(m.title)}}
    });

  }


}
