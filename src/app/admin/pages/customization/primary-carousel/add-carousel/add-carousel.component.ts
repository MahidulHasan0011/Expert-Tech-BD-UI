import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ShopService } from '../../../../../services/shop.service';
import { ProductService } from '../../../../../services/product.service';
import { UiService } from '../../../../../services/ui.service';
import { ReloadService } from '../../../../../services/reload.service';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { Carousel } from '../../../../../interfaces/carousel';
import { FileData } from '../../../../../interfaces/file-data';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { ImageGalleryDialogComponent } from '../../../gallery/image-gallery-dialog/image-gallery-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  styleUrls: ['./add-carousel.component.scss'],
})
export class AddCarouselComponent implements OnInit {
  dataForm: FormGroup;
  private sub: Subscription;

  // Image
  chooseImage?: string[] = [];

  autoSlug = true;
  isLoading = false;

  @ViewChild('formDirective') formDirective: NgForm;
  title = new FormControl(null);
  priority = new FormControl(null);
  subTitle = new FormControl(null);
  url = new FormControl(null, { validators: [Validators.required] });
  image = new FormControl(null);

  // Store Data from param
  id?: string;

  // Image Upload
  imgPlaceHolder = '/assets/images/png/image-placeholder-r1.png';
  pickedImage?: string;
  file: any = null;
  newFileName: string;
  Carousel: Carousel;
  // Destroy Session
  needSessionDestroy = true;

  constructor(
    private shopService: ShopService,
    private productService: ProductService,
    private dialog: MatDialog,
    private uiService: UiService,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService,
    private storageService: StorageService,
    public router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      title: this.title,
      priority: this.priority,
      subTitle: this.subTitle,
      url: this.url,
    });

    this.pickedImage = this.imgPlaceHolder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT')) {
        this.dataForm.patchValue(
          this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT')
        );
      }

      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.dataForm.patchValue({ image: this.pickedImage });
      }
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      // console.log('Id: ', this.id);
      if (this.id) {
        this.getSingleCarouselById();
      }
    });
  }

  /**
   * ON SUBMIT
   */

  //  onSubmit() {
  //   if (this.dataForm.invalid) {
  //     return;
  //   }

  //   // const data = {...this.dataForm.value, ...{image: null}};

  //   if (this.file === null) {
  //     this.uiService.warn('No Image Added!')
  //     // this.addNewCarousel(data);
  //   } else {
  //     this.addCarouselWithImage();
  //   }
  // }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    const rawData = this.dataForm.value;
    const finalData = {
      ...rawData,
    };

    if (this.Carousel) {
      const mEditData = {
        ...finalData,
        ...{ _id: this.Carousel._id },
      };
      this.editCarousel(mEditData);
    } else {
      // this.addNewCarousel(finalData);
      this.addCarouselWithImage();
    }

    // const data = {...this.dataForm.value, ...{image: null}};

    // if (this.chooseImage === null) {
    //   this.uiService.warn('No Image Added!');
    //   this.addNewCarousel(data);
    // } else if(this.Carousel){
    //   const mEditData = {
    //     ...finalData,
    //     ...{ _id: this.Carousel._id },
    //   };
    //   this.editCarousel(mEditData);
    // } else {
    //   this.addCarouselWithImage();
    // }
  }

  /**
   * HTTP REQ HANDLE
   */

  private getSingleCarouselById() {
    this.spinner.show();
    this.shopService.getSingleCarouselById(this.id).subscribe(
      (res) => {
        this.Carousel = res.data;
        // console.log('Carousel:', this.Carousel);
        if (this.Carousel) {
          this.setFormData();
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private addNewCarousel(data: Carousel) {
    this.isLoading = true;
    this.shopService.addNewCarousel(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCarousel$();
        this.isLoading = false;
        this.formDirective.resetForm();
        this.file = null;
        this.imgPlaceHolder = '/assets/images/png/image-placeholder-r1.png';
        this.pickedImage = this.imgPlaceHolder;
        this.spinner.hide();
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  private editCarousel(data: Carousel) {
    this.spinner.show();
    this.shopService.editCarousel(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  /**
   * IMAGE UPLOAD
   */

  fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name
      .toLowerCase()
      .split(' ')
      .join('-')
      .split('.')
      .shift();
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

  addCarouselWithImage() {
    // console.log(this.chooseImage);
    const data: FileData = {
      fileName: this.newFileName,
      file: null,
      images: this.chooseImage[0],
      folderPath: 'carousels',
    };
    // console.log(this.chooseImage[0]);
    this.dataForm.value.url = decodeURIComponent(this.dataForm.value.url);

    const final = { ...this.dataForm.value, ...{ image: this.chooseImage[0] } };
    this.file = null;
    this.addNewCarousel(final);
  }

  // addCarouselWithImage() {
  //   const data: FileData = {
  //     fileName: this.newFileName,
  //     file: this.file,
  //     folderPath: 'carousels'
  //   };
  //   this.fileUploadService.uploadSingleImage(data)
  //     .subscribe(res => {
  //       this.dataForm.value.url = decodeURIComponent(this.dataForm.value.url);

  //       const final = {...this.dataForm.value, ...{image: res.downloadUrl}};
  //       this.file = null;
  //       console.log(final)
  //       this.addNewCarousel(final);
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  /**
   * ON HOLD INPUT DATA
   */
  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(
      this.dataForm?.value,
      'PROMOTIONAL_OFFER_INPUT'
    );
  }
  public openComponentDialog() {
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      maxHeight: '80vh',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (
          dialogResult.data &&
          dialogResult.data.length > 0 &&
          dialogResult.data.length <= 1
        ) {
          this.getPickedImages(dialogResult.data);
          // console.log(dialogResult.data);
          this.pickedImage = this.chooseImage[0];
          this.uiService.success('Images choosed successfully');
        } else if (dialogResult.data.length > 1) {
          this.uiService.warn('Cannot choose multiple images at a time');
        }
      }
    });
  }
  private getPickedImages(images: ImageGallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map((m) => m.url);
      // console.log(nImages);
      this.chooseImage = this.utilsService.mergeArrayString(
        nImages,
        this.chooseImage
      );
    } else {
      this.chooseImage = images.map((m) => m.url);
    }
    this.dataForm.patchValue({ images: this.chooseImage });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.Carousel);

    if (this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT')) {
      this.dataForm.patchValue(
        this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT')
      );
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue({ image: this.pickedImage });
    } else {
      this.pickedImage = this.Carousel.image
        ? this.Carousel.image
        : this.imgPlaceHolder;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
    }
  }
}
