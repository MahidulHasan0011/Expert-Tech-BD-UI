import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ShopService} from "../../../../../services/shop.service";
import {ProductService} from "../../../../../services/product.service";
import {FileUploadService} from "../../../../../services/file-upload.service";
import {ReloadService} from "../../../../../services/reload.service";
import {UiService} from "../../../../../services/ui.service";
import {OfferBanner} from "../../../../../interfaces/offer-banner";
import {FileData} from "../../../../../interfaces/file-data";


@Component({
  selector: 'app-add-offer-tab',
  templateUrl: './add-offer-tab.component.html',
  styleUrls: ['./add-offer-tab.component.scss']
})
export class AddOfferTabComponent implements OnInit {

  temp: string = "Angular"

  tabId: string;
  dataForm: FormGroup;

  autoSlug = true;
  isLoading = false;
  needAuthorEdit = false;

  @ViewChild('formDirective') formDirective: NgForm;
  title = new FormControl(null);
  url = new FormControl(null, {validators: [Validators.required]});
  priority = new FormControl(null, {validators: [Validators.required]});

  // Image Upload
  imgPlaceHolder = '/assets/images/png/image-placeholder-r1.png';
  file: any = null;
  newFileName: string;


  constructor(
    private shopService: ShopService,
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private router: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    this.dataForm = new FormGroup({
      title: this.title,
      url: this.url,
      priority: this.priority,
    });

  }

  /**
   * ON SUBMIT
   */

  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    // const data = {...this.dataForm.value, ...{image: null}};
    if (this.file === null) {
      this.uiService.warn('No Image Added!')
    } else {
      this.addNewOfferBannerWithImage();
    }
  }


  /**
   * HTTP REQ HANDLE
   */

  private addNewOfferBanner(data: OfferBanner) {
    this.isLoading = true;
    this.shopService.createNewOfferBanner(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshOfferTab$()
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

  addNewOfferBannerWithImage() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.file,
      folderPath: 'offer-banner'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        // console.log(res.downloadUrl);

        this.dataForm.value.url = decodeURIComponent(this.dataForm.value.url);

        const final: OfferBanner = {...this.dataForm.value, ...{image: res.downloadUrl}};

        this.file = null;
        this.addNewOfferBanner(final);
      }, error => {
        console.log(error);
      });
  }

}
