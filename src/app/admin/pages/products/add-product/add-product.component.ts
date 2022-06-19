import {Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AppService} from 'src/app/app.service';
import {Subscription} from 'rxjs';
import {MatSelectChange} from '@angular/material/select';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {isPlatformBrowser} from '@angular/common';
import {Category} from "../../../../interfaces/category";
import {Brand} from "../../../../interfaces/brand";
import {SubCategory} from "../../../../interfaces/sub-category";
import {Select} from "../../../../interfaces/select";
import {ProductService} from "../../../../services/product.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {UiService} from "../../../../services/ui.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {Product} from "../../../../interfaces/product";
import {ImageGalleryComponent} from '../../gallery/image-gallery/image-gallery.component';
// import { ImageGalleryDialogComponent } from '../../gallery/image-gallery-dialog/image-gallery-dialog.component';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { UtilsService } from 'src/app/services/utils.service';
import { ImageGalleryDialogComponent } from '../../gallery/image-gallery-dialog/image-gallery-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  private sup: Subscription;

  isLoading = false;
  public form: FormGroup;

  public categories: Category[];
  public brands: Brand[];
  public subCategories: SubCategory[];

  // Image
  chooseImage?: string[] = [];

  // Select Filter
  public filteredCatList: Category[];
  public filteredSubCatList: SubCategory[];
  public filteredBrandList: Brand[];

  private finalProduct: any = null;

  private sub: any;
  public id: any;

  // Filter Area
  filterDataFields: any[] = [];
  filtersFields: object = {};

  // Multiple Image Upload
  @ViewChild('imagePicker') imagePicker: ElementRef;
  pickedImageFiles: string[] = [];
  imageFiles: any[] = [];
  pickedFiles: File[] = [];

  // Form Data
  dataForm: FormGroup;

  autoSlug = true;

  name = new FormControl(null, {validators: [Validators.required]});
  slug = new FormControl(null, {validators: [Validators.required]});
  oldPrice = new FormControl(null);
  newPrice = new FormControl(null, {validators: [Validators.required]});
  discount = new FormControl(null);
  availableQuantity = new FormControl(null, {validators: [Validators.required]});
  productCode = new FormControl(null);
  // Selectable
  category = new FormControl(null, {validators: [Validators.required]});
  brand = new FormControl(null);
  subCategory = new FormControl(null, {validators: [Validators.required]});
  mpn = new FormControl('');
  emi = new FormControl(null, {validators: [Validators.required]});
  description = new FormControl('');
  youtubeUrl = new FormControl(null);

  editorConfigDesc: AngularEditorConfig = {
    editable: true,
    minHeight: '250px',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter/Copy product descriptions...',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'italic',
        'strikeThrough',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'fontName'
      ],
      [
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
      ]
    ]
  };
  // Short Specifications
  @ViewChild('shortFeatures') shortFeatures: any;

  // Reset
  @ViewChild('formDirective') formDirective: NgForm;

  // Specification Table
  specificationTable = [
    {
      heading: '',
      tableData: [
        {
          name: '',
          value: ''
        },
        {
          name: '',
          value: ''
        }
      ]
    }
  ];

  // emi
  emiOption: Select[] = [
    {
      value: true,
      viewValue: 'EMI Enabled'
    },
    {
      value: false,
      viewValue: 'EMI Disabled'
    },
  ];

  constructor(
    public appService: AppService,
    public productService: ProductService,
    public fileUploadService: FileUploadService,
    private uiService: UiService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
  }

  ngOnInit(): void {

    this.dataForm = new FormGroup({
      name: this.name,
      slug: this.slug,
      oldPrice: this.oldPrice,
      newPrice: this.newPrice,
      discount: this.discount,
      availableQuantity: this.availableQuantity,
      productCode: this.productCode,
      category: this.category,
      brand: this.brand,
      subCategory: this.subCategory,
      mpn: this.mpn,
      emi: this.emi,
      description: this.description,
      youtubeUrl: this.youtubeUrl
    });

    this.autoGenerateSlug();

    this.getCategoryList();
    this.getBrandList();

  }

  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'No Image Added',
        message: 'Are you sure you want continue without image?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.addNewProduct(this.finalProduct);
      }
    });
  }


  /**
   * ON FORM SUBMIT ACTION
   */

  public onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all required field');
      return;
    }
    this.finalProduct = {
      name: this.dataForm.value.name,
      slug: this.checkSlug(this.dataForm.value.slug),
      category: this.dataForm.value.category._id,
      categorySlug: this.dataForm.value.category.slug,
      categoryName: this.dataForm.value.category.categoryName,
      brand: this.dataForm.value.brand !== null ? this.dataForm.value.brand._id : null,
      brandSlug: this.dataForm.value.brand !== null ? this.dataForm.value.brand.slug : null,
      brandName: this.dataForm.value.brand !== null ? this.dataForm.value.brand.brandName : null,
      subCategory: this.dataForm.value.subCategory._id,
      subCatSlug: this.dataForm.value.subCategory.slug,
      subCatName: this.dataForm.value.subCategory.subCatName,
      productCode: this.dataForm.value.productCode,
      regularPrice: this.dataForm.value.oldPrice,
      salePrice: this.dataForm.value.newPrice,
      discount: this.dataForm.value.discount,
      availableQuantity: this.dataForm.value.availableQuantity,
      mpn: this.dataForm.value.mpn,
      description: this.dataForm.value.description,
      images: null,
      productImages: this.chooseImage,
      isEMI: this.dataForm.value.emi,
      features: this.shortFeatures.value,
      specification: this.specificationTable,
      ratingsCount: 0,
      ratingsValue: 0,
      filters: this.filtersFields,
      youtubeUrl: this.dataForm.value.youtubeUrl,
    };

    // if (this.pickedImageFiles.length > 0) {
    //   console.log(this.pickedImageFiles.length);
    //   this.addProductWithImage(this.finalProduct);
    // } else {
    //   this.openConfirmDialog();
    // }

    if (this.chooseImage && this.chooseImage.length) {
      this.addNewProduct(this.finalProduct);
    } else {
      this.openConfirmDialog();
    }
  }


  /**
   * HTTP REQ HANDLE
   */

  private getCategoryList() {
    this.productService.getAllCategoryList()
      .subscribe(res => {
        this.categories = res.data;
        this.filteredCatList = this.categories.slice();
      }, error => {
        console.log(error);
      });
  }

  private getBrandList() {
    this.productService.getAllBrandList()
      .subscribe(res => {
        this.brands = res.data;
        this.filteredBrandList = this.brands.slice();
      }, error => {
        console.log(error);
      });
  }

  // private getSubCategoriesList() {
  //   this.productService.getAllSubCategoryList()
  //     .subscribe(res => {
  //       this.subCategories = res.data;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  private getSubCategoriesByParent(parentCatId: string) {
    this.productService.getSubCatListByParentCatId(parentCatId)
      .subscribe(res => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
      }, error => {
        console.log(error);
      });
  }

  private addNewProduct(data: Product) {
    this.isLoading = true;
    this.productService.addNewProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.isLoading = false;
        this.removeAllFiles();
        this.formDirective.resetForm();
        this.removeCatFilter();
        this.finalProduct = null;
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }


  /**
   * IMAGE PICKER
   */

  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.pickedFiles.push(event.target.files[i]);
        this.pickedImageFiles.push(event.target.files[i]);
        const reader = new FileReader();
        reader.onload = () => {
          this.imageFiles.push(reader.result as string);
        };

        reader.readAsDataURL(event.target.files[i]);
      }

    }

  }

  removeFile(i: number) {
    this.pickedImageFiles.splice(i, 1);
    this.imageFiles.splice(i, 1);
  }

  removeAllFiles() {
    this.imagePicker.nativeElement.value = null;
    this.pickedImageFiles = [];
    this.imageFiles = [];
  }



  removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }
  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  addProductWithImage(product: Product) {
    // this.spinner.show();
    this.spinner.show();
    const imageResults: any[] = [];

    this.pickedImageFiles.forEach((file, index) => {
      const fileName = this.dataForm.value.slug + this.getRandomInt(10, 50000) + '.' + this.pickedFiles[index].name.split('.').pop();
      this.fileUploadService.uploadSingleConvertToMulti(file, fileName)
        .subscribe(result => {
          imageResults.push(result.images);
          if (imageResults.length === this.pickedImageFiles.length) {
            console.log(imageResults);
            const images = imageResults;
            const final = {...product, ...{images}};
            // console.log(final);
            this.addNewProduct(final);
            this.spinner.hide();
          }
        }, error => {
          this.isLoading = false;
          this.spinner.hide();
          console.log(error);
        });
    });

  }

  // addProductWithImage(product: Product) {
  //   this.isLoading = true;
  //   this.fileUploadService.uploadMultiImageOriginal(this.pickedImageFiles)
  //     .subscribe(result => {
  //       const images = result.downloadUrls;
  //       const final = {...product, ...{images}};
  //       // console.log(final);
  //       this.addNewProduct(final);
  //     }, error => {
  //       this.isLoading = false;
  //       console.log(error);
  //     });
  // }

  /**
   * LOGICAL PART
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sup = this.dataForm.get('name').valueChanges
        .pipe(
        ).subscribe(d => {
          // var fixed  = string.replace(/,|\.|-/g, '');
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sup.unsubscribe();
    }
  }

  /**
   * CHANGE CATEGORY SELECT
   */
  onSelectChange(event: MatSelectChange, i: number, data: any) {
    const d = {[data.key]: event.value};
    this.filtersFields = {...this.filtersFields, ...d};
  }


  onSelectCategory(event: MatSelectChange) {
    this.getSubCategoriesByParent(event.value._id);
    // this.filterDataFields = this.categories.find(x => x._id === event.value._id).filters;
  }
  onSelectSubCategory(event: MatSelectChange) {
    this.filterDataFields = this.subCategories.find(x => x._id === event.value._id).filters;
  }
  removeCatFilter() {
    this.filtersFields = {};
    this.filterDataFields = [];
    this.shortFeatures.value = [];
    this.specificationTable = [
      {
        heading: '',
        tableData: [
          {
            name: '',
            value: ''
          },
          {
            name: '',
            value: ''
          }
        ]
      }
    ];
  }


  /**
   * ON SELECT CHANGE
   * CHANGE SHORT SPECIFICATIONS
   */
  change(event) {
  }

  onCategorySelectChange(event: MatSelectChange) {

  }


  /**
   * TABLE LOGICAL METHODS
   */

  onAddTable() {
    const table = {
      heading: '',
      tableData: [
        {
          name: '',
          value: ''
        },
        {
          name: '',
          value: ''
        }
      ]
    };
    this.specificationTable.push(table);
    const element = document.getElementById('main-add-container');
    console.log(element.scrollHeight);
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({
          left: 0,
          top: element.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 200);
  }

  onAddTableRow(tableIndex: number) {
    const row = {
      name: '',
      value: ''
    };
    this.specificationTable[tableIndex].tableData.push(row);
  }

  onDeleteTable(i: number) {
    this.specificationTable.splice(i, 1);
  }

  onRemoveRow(i: number, ic: number) {
    this.specificationTable[i].tableData.splice(ic, 1);
  }

  /**
   * CHECK SLUG
   */

  private checkSlug(slug: string): string {
    return slug.toLowerCase().replace(/\s|_|#|[\(\)]|,/g, '-');
  }

  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  public openComponentDialog() {
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      maxHeight: '80vh',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0 && dialogResult.data.length <= 5) {
          this.getPickedImages(dialogResult.data);
          console.log(dialogResult.data);
          this.uiService.success("Images choosed successfully");
        }
        else if(dialogResult.data.length > 5){
            this.uiService.warn("Cannot choose more than 5 images");
        }
      }
    });
  }

  private getPickedImages(images: ImageGallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      console.log(nImages);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }


}
