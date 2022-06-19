import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ShopService} from "../../../../../services/shop.service";
import {ProductService} from "../../../../../services/product.service";
import {UiService} from "../../../../../services/ui.service";
import {ReloadService} from "../../../../../services/reload.service";
import {FileUploadService} from "../../../../../services/file-upload.service";
import {OfferPackage} from "../../../../../interfaces/offer-package";
import {FileData} from "../../../../../interfaces/file-data";
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { MatDialog } from '@angular/material/dialog';
import { ImageGalleryDialogComponent } from '../../../gallery/image-gallery-dialog/image-gallery-dialog.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-offer-package',
  templateUrl: './add-offer-package.component.html',
  styleUrls: ['./add-offer-package.component.scss']
})
export class AddOfferPackageComponent implements OnInit {

  dataForm: FormGroup;

  // Image
  chooseImage?: string[] = [];

  autoSlug = true;
  isLoading = false;

  @ViewChild('formDirective') formDirective: NgForm;
  title = new FormControl(null, {validators: [Validators.required]});
  shortDesc = new FormControl(null, {validators: [Validators.required]});
  validation = new FormControl(null, {validators: [Validators.required]});
  branch = new FormControl(null, {validators: [Validators.required]});
  description = new FormControl(null, {validators: [Validators.required]});

  // Image Upload
  imgPlaceHolder = '/assets/images/png/image-placeholder-r1.png';
  file: any = null;
  newFileName: string;

  branches = [
    {viewValue: 'All Branch', value: 'All Branch'},
    {viewValue: 'All', value: 'All'},
  ];

  editorConfigDesc: AngularEditorConfig = {
    editable: true,
    minHeight: '250px',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter offer details...',
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


  constructor(
    private shopService: ShopService,
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      title: this.title,
      shortDesc: this.shortDesc,
      validation: this.validation,
      branch: this.branch,
      description: this.description
    });

  }

  /**
   * ON SUBMIT
   */

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field')
      return;
    }


    // if (this.file === null) {
    if (this.chooseImage === null) {
      this.uiService.warn('No Image Added!')
    } else {
      this.addOfferPackageWithImage();
    }
  }


  /**
   * HTTP REQ HANDLE
   */

  private addOfferPackage(data: OfferPackage) {
    this.isLoading = true;
    this.shopService.addOfferPackage(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCarousel$()
        this.isLoading = false;
        this.formDirective.resetForm();
        this.file = null;
        this.imgPlaceHolder = '/assets/images/png/image-placeholder-r1.png';
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  /**
   * IMAGE UPLOAD
   */

  fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      this.imgPlaceHolder = reader.result as string;
    };

    if (event.target.files[0]) {
      // console.log(this.file);
    }
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  addOfferPackageWithImage() {
    const data: FileData = {
      fileName: this.newFileName,
      file: null,
      images: this.chooseImage[0],
      folderPath: 'offer_package'
    };

        const final = {...this.dataForm.value, ...{image: this.chooseImage[0]}};
        this.file = null;
        this.addOfferPackage(final);

  }

  // addOfferPackageWithImage() {
  //   const data: FileData = {
  //     fileName: this.newFileName,
  //     file: this.file,
  //     folderPath: 'offer_package'
  //   };
  //   this.fileUploadService.uploadSingleImage(data)
  //     .subscribe(res => {
  //       const final = {...this.dataForm.value, ...{image: res.downloadUrl}};
  //       this.file = null;
  //       this.addOfferPackage(final);
  //     }, error => {
  //       console.log(error);
  //     });
  // }

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
        if (dialogResult.data && dialogResult.data.length > 0 && dialogResult.data.length <= 1) {
          this.getPickedImages(dialogResult.data);
          console.log(dialogResult.data);
          this.imgPlaceHolder = this.chooseImage[0];
          this.uiService.success("Images choosed successfully");
        }
        else if (dialogResult.data.length > 1) {
          this.uiService.warn("Cannot choose multiple images at a time");
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
      { images: this.chooseImage }
    );
  }


}
