import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ImageFormat, Product } from '../../../../interfaces/product';
import { Category } from '../../../../interfaces/category';
import { Brand } from '../../../../interfaces/brand';
import { SubCategory } from '../../../../interfaces/sub-category';
import { ProductService } from '../../../../services/product.service';
import { ReloadService } from '../../../../services/reload.service';
import { FileUploadService } from '../../../../services/file-upload.service';
import { UiService } from 'src/app/services/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ImageGalleryDialogComponent } from '../../gallery/image-gallery-dialog/image-gallery-dialog.component';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  private sup: Subscription;
  productId: string = null;
  product: Product = null;
  public PRODUCT_IMAGES_SRC: string = null;

  isLoading = false;
  public form: FormGroup;
  allImages = [];

  // Image
  chooseImage?: string[] = [];

  public categories: Category[];
  public brands: Brand[];
  public subCategories: SubCategory[];

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

  name = new FormControl(null, { validators: [Validators.required] });
  slug = new FormControl(null, { validators: [Validators.required] });
  oldPrice = new FormControl(null);
  newPrice = new FormControl(null, { validators: [Validators.required] });
  discount = new FormControl(null);
  availableQuantity = new FormControl(null, {
    validators: [Validators.required],
  });
  productCode = new FormControl(null);
  // Selectable
  category = new FormControl(null, { validators: [Validators.required] });
  brand = new FormControl(null);
  subCategory = new FormControl(null, { validators: [Validators.required] });
  mpn = new FormControl('');
  description = new FormControl('');
  youtubeUrl = new FormControl(null);

  // Additional Complex Data
  selectedCat: Category = null;
  selectedSubCat: SubCategory = null;
  selectedBrand: Brand = null;
  selectedTagsData: string[] = [];
  exitsImageFiles: any = [];

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
        'fontName',
      ],
      [
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
      ],
    ],
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
          value: '',
        },
        {
          name: '',
          value: '',
        },
      ],
    },
  ];

  // @ts-ignore
  constructor(
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    private reloadService: ReloadService,
    public fileUploadService: FileUploadService,
    private uiService: UiService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    @Inject(PLATFORM_ID) public platformId: any
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.productId = param.get('id');
      this.getSingleProductById(this.productId);
    });

    this.reloadService.refreshProduct$.subscribe(() => {
      this.getSingleProductById(this.productId);
    });

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
      description: this.description,
      youtubeUrl: this.youtubeUrl,
    });

    this.autoGenerateSlug();

    this.getCategoryList();
    this.getBrandList();
  }

  /**
   * SET FORM DATA
   */

  private setFormValue() {
    this.selectedCat = {
      _id: this.product.category as string,
      categoryName: this.product.categoryName,
      slug: this.product.categorySlug,
    };
    this.selectedSubCat = {
      _id: this.product.subCategory as string,
      subCatName: this.product.subCatName,
      parentCategory: this.product.category,
      parentCategoryName: this.product.categoryName,
      slug: this.product.subCatSlug,
    };
    this.selectedBrand = {
      _id: this.product.brand as string,
      brandName: this.product.brandName,
      slug: this.product.brandSlug,
    };
    // @ts-ignore
    if ('specification' in this.product.extraData) {
      this.dataForm.patchValue({
        name: this.product.name,
        slug: this.product.slug,
        specification: this.product.extraData.specification,
        oldPrice: this.product.regularPrice,
        newPrice: this.product.salePrice,
        discount: this.product.discount,
        youtubeUrl: this.product.youtubeUrl,
        availableQuantity: this.product.availableQuantity,
        productCode: this.product.productCode,
        category: this.product?.categoryName,
        brand: this.product?.brandName,
        subCategory: this.product?.subCatName,
        mpn: this.product?.extraData.mpn,
        description: this.product?.extraData.description,
      });
    }

    this.filtersFields = this.product.filters;
    // @ts-ignore
    this.specificationTable = this.product.extraData.specification;
    this.selectedTagsData = this.product?.features;
    if (this.product.productImages && this.product.productImages.length > 0 && this.product.images && this.product.images.length > 0) {
      console.log("Product Images");
      this.exitsImageFiles = this.product.productImages;
      this.exitsImageFiles.push(this.product.images);
      console.log("p. images = ", this.exitsImageFiles);
      console.log("product ", this.product);
      
    }if (this.product.productImages && this.product.productImages.length > 0) {
      console.log("Product Images");
      this.exitsImageFiles = this.product.productImages;
      console.log("p. images = ", this.exitsImageFiles);
      console.log("product ", this.product);
      
    } else {
      console.log("Images");
      const images = this.product.images.map((item) => {
        let container = {};

        container = item.big;

        return container;
      });
      this.exitsImageFiles = images;
    }
    // if (this.data.author.image !== null) {
    //   this.imgPlaceHolder = this.data.author.image;
    // }
  }

  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'No Image Added',
        message: 'Are you sure you want continue without image?',
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.editProductData(this.finalProduct);
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
      product: {
        _id: this.product?._id,
        name: this.dataForm.value.name,
        slug: this.checkSlug(this.dataForm.value.slug),
        category: this.selectedCat._id,
        categorySlug: this.selectedCat.slug,
        categoryName: this.selectedCat.categoryName,
        brand:
          this.dataForm.value.brand !== null ? this.selectedBrand._id : null,
        brandSlug:
          this.dataForm.value.brand !== null ? this.selectedBrand.slug : null,
        brandName:
          this.dataForm.value.brand !== null
            ? this.selectedBrand.brandName
            : null,
        subCategory: this.selectedSubCat._id,
        subCatSlug: this.selectedSubCat.slug,
        subCatName: this.selectedSubCat.subCatName,
        productCode: this.dataForm.value.productCode,
        regularPrice: this.dataForm.value.oldPrice,
        salePrice: this.dataForm.value.newPrice,
        discount: this.dataForm.value.discount,
        youtubeUrl: this.dataForm.value.youtubeUrl,
        availableQuantity: this.dataForm.value.availableQuantity,
        images: null,
        filters: this.filtersFields,
        features: this.shortFeatures.value,
      },
      extraData: {
        // @ts-ignore
        _id: this.product?.extraData._id,
        // @ts-ignore
        ratingsCount: this.product?.extraData.ratingsCount,
        // @ts-ignore
        ratingsValue: this.product?.extraData.ratingsValue,
        description: this.dataForm.value.description,
        // @ts-ignore
        isEMI: this.product?.extraData.isEMI,
        mpn: this.dataForm.value.mpn,
        // @ts-ignore
        reviews: this.product?.extraData.reviews,
        specification: this.specificationTable,
      },
    };

    if (this.pickedImageFiles.length > 0) {
      console.log("final product : ", this.finalProduct);
      this.finalProduct.product.productImages = this.allImages;
      this.editProductData(this.finalProduct);
    } else {
      let imagesData;
      if (this.exitsImageFiles !== null && this.exitsImageFiles.length !== 0) {
        imagesData = this.exitsImageFiles;
      } else {
        imagesData = null;
      }
      this.finalProduct.product.productImages = imagesData;
      // this.openConfirmDialog()
      console.log("final product : ", this.finalProduct);
      this.editProductData(this.finalProduct);
    }
  }

  /**
   * HTTP REQ HANDLE
   */

  public getSingleProductById(id: string) {
    this.spinner.show();
    this.productService.getSingleProductById(id).subscribe(
      (res) => {
        this.product = res.data;
        this.getSubCategoriesByParent(this.product.category as string);
        this.setFormValue();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  private getCategoryList() {
    this.productService.getAllCategoryList().subscribe(
      (res) => {
        this.categories = res.data;
        this.filteredCatList = this.categories.slice();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getBrandList() {
    this.productService.getAllBrandList().subscribe(
      (res) => {
        this.brands = res.data;
        this.filteredBrandList = this.brands.slice();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getSubCategoriesList() {
    this.productService.getAllSubCategoryList().subscribe(
      (res) => {
        this.subCategories = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getSubCategoriesByParent(parentCatId: string) {
    this.productService.getSubCatListByParentCatId(parentCatId).subscribe(
      (res) => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
        this.filterDataFields = this.subCategories.find(
          (f) => f._id === this.product.subCategory
        ).filters;
        console.log('FROM HERE');
        console.log(this.filterDataFields);
        console.log(this.product.filters);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private editProductData(data: any) {
    console.log(data);
    this.isLoading = true;
    this.productService.editProductData(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.isLoading = false;
        // this.removeAllFiles();
        // this.formDirective.resetForm();
        // this.removeCatFilter();
        // this.finalProduct = null;
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * IMAGE UPLOAD
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

  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage(s: string) {
    const index = this.exitsImageFiles.findIndex((x) => x === s);
    this.exitsImageFiles.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.exitsImageFiles,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  editProductWithImage(product: any) {
    this.spinner.show();
    const imageResults: any[] = [];
    console.log("New picked", this.pickedImageFiles);

    this.pickedImageFiles.forEach((file, index) => {
      const fileName =
        this.dataForm.value.slug +
        this.getRandomInt(10, 50000) +
        '.' +
        this.pickedFiles[index].name.split('.').pop();

        console.log(fileName);

      this.fileUploadService
        .uploadSingleConvertToMulti(file, fileName)
        .subscribe(
          (result) => {
            imageResults.push(result.images);
            if (imageResults.length === this.pickedImageFiles.length) {
              let imagesData;
              if (
                this.exitsImageFiles !== null &&
                this.exitsImageFiles.length !== 0
              ) {
                imagesData = imageResults.concat(this.exitsImageFiles);
                console.log("imagesData : ",imagesData)
              } else {
                imagesData = imageResults;
              }
              this.finalProduct.product.images = imagesData;
              this.editProductData(this.finalProduct);
              this.spinner.hide();
            }
          },
          (error) => {
            this.isLoading = false;
            this.spinner.hide();
            console.log(error);
          }
        );
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
      this.sup = this.dataForm
        .get('name')
        .valueChanges.pipe()
        .subscribe((d) => {
          const res = d
            ?.trim()
            .replace(/[^A-Z0-9]+/gi, '-')
            .toLowerCase();
          this.dataForm.patchValue({
            slug: res,
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
    const d = { [data.key]: event.value };
    this.filtersFields = { ...this.filtersFields, ...d };
  }

  onSelectCategory(event: any, cat: Category) {
    if (event.isUserInput) {
      this.selectedCat = cat;
      this.getSubCategoriesByParent(cat._id);
      // this.filterDataFields = this.categories.find(x => x._id === cat._id).filters;
    }
  }

  onSelectSubCategory(event: any, subCat: SubCategory) {
    if (event.isUserInput) {
      this.selectedSubCat = subCat;
      this.filterDataFields = this.subCategories.find(
        (x) => x._id === event.value._id
      ).filters;
    }
  }

  onSelectBrand(event: any, brand: Brand) {
    if (event.isUserInput) {
      this.selectedBrand = brand;
    }
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
            value: '',
          },
          {
            name: '',
            value: '',
          },
        ],
      },
    ];
  }

  /**
   * ON SELECT CHANGE
   * CHANGE SHORT SPECIFICATIONS
   */
  change(event) { }

  onCategorySelectChange(event: MatSelectChange) { }

  /**
   * TABLE LOGICAL METHODS
   */

  onAddTable() {
    const table = {
      heading: '',
      tableData: [
        {
          name: '',
          value: '',
        },
        {
          name: '',
          value: '',
        },
      ],
    };
    this.specificationTable.push(table);
    const element = document.getElementById('main-add-container');
    console.log(element.scrollHeight);
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({
          left: 0,
          top: element.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 200);
  }

  onAddTableRow(tableIndex: number) {
    const row = {
      name: '',
      value: '',
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
   * PARALAL HTTP HANDLE
   */
  public removeFileMulti(image: ImageFormat, i: number) {
    const updateImages = this.exitsImageFiles;
    updateImages.splice(i, 1);

    const removeFile = this.fileUploadService.removeFileMulti(image);
    const removeData = this.productService.updateProductImageField(
      this.productId,
      updateImages
    );

    forkJoin([removeFile, removeData]).subscribe((results) => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshProduct$();
    });
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

  getExistFiltersValue(i: number, key: string) {
    if (this.filtersFields) {
      return this.filtersFields[key];
    } else {
      return null;
    }
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
          console.log(this.pickedImageFiles);
          console.log(this.exitsImageFiles);
          this.allImages = [];
          this.exitsImageFiles.forEach((url) => {
            console.log(url);
            this.allImages.push(url);
          });
          this.pickedImageFiles.forEach((url) => {
            console.log(url);
            this.allImages.push(url);
          });
          console.log(this.allImages);
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
      this.pickedImageFiles = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
      this.pickedImageFiles = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }

  
}
