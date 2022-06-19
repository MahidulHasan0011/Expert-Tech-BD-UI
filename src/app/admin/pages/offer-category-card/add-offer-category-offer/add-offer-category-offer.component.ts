import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferCategoryCardService } from '../../../../services/offer-category-card.service';
import { UiService } from '../../../../services/ui.service';
import { ReloadService } from '../../../../services/reload.service';
import { FileUploadService } from '../../../../services/file-upload.service';
import { OfferCategoryCard } from '../../../../interfaces/offer-category-card';
import { FileData } from '../../../../interfaces/file-data';
import { PromotionalOffer } from '../../../../interfaces/promotional-offer';
import { PromotionalOfferService } from '../../../../services/promotional-offer.service';
import { MatSelectChange } from '@angular/material/select';
import { StorageService } from '../../../../services/storage.service';
import { UtilsService } from '../../../../services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-offer-category-offer',
  templateUrl: './add-offer-category-offer.component.html',
  styleUrls: ['./add-offer-category-offer.component.scss'],
})
export class AddOfferCategoryOfferComponent implements OnInit {
  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  promotionalOffer: PromotionalOffer;
  OfferCategoryCard: OfferCategoryCard;
  promotionalOffers: PromotionalOffer[] = [];

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  // editorConfigDesc: AngularEditorConfig = {
  //   editable: true,
  //   minHeight: '250px',
  //   enableToolbar: true,
  //   showToolbar: true,
  //   placeholder: 'Enter/Copy Description...',
  //   sanitize: false,
  //   toolbarPosition: 'top',
  //   translate: 'no',
  //   defaultParagraphSeparator: 'p',
  //   defaultFontName: 'Arial',
  //   toolbarHiddenButtons: [['bold']],
  // };

  // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private promotionalOfferService: PromotionalOfferService,
    private OfferCategoryCardService: OfferCategoryCardService // public textEditorCtrService: TextEditorCtrService,
  ) {}

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      link: [null, Validators.required],
      description: [null],
      image: [null],
      priority: [null, Validators.required],
      promotionalOffer: [null, Validators.required],
    });

    this.pickedImage = this.placeholder;

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
      console.log('Id: ', this.id);
      if (this.id) {
        this.getSingleOfferCategoryCardById();
      }
    });
    this.getAllPromotionalOffer();
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.OfferCategoryCard);

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
      this.pickedImage = this.OfferCategoryCard.image
        ? this.OfferCategoryCard.image
        : this.placeholder;
    }
  }

  /**
   * ONSUBMIT
   */
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    const rawData = this.dataForm.value;
    // console.log('rawData:', rawData);
    const finalData = {
      ...rawData,
    };

    if (this.OfferCategoryCard) {
      const mEditData = {
        ...finalData,
        ...{ _id: this.OfferCategoryCard._id },
      };
      this.editOfferCategoryCardData(mEditData);
    } else {
      console.log(this.dataForm.value);
      this.addNewOfferCategoryCard(finalData);
    }
  }

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

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewOfferCategoryCard(data: OfferCategoryCard) {
    this.spinner.show();
    this.OfferCategoryCardService.addNewOfferCategoryCard(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
        this.pickedImage = this.placeholder;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getSingleOfferCategoryCardById() {
    this.spinner.show();
    this.OfferCategoryCardService.getSingleOfferCategoryCardById(
      this.id
    ).subscribe(
      (res) => {
        this.OfferCategoryCard = res.data;
        console.log('OfferCategoryCard:', this.OfferCategoryCard);
        if (this.OfferCategoryCard) {
          this.setFormData();
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private editOfferCategoryCardData(data: OfferCategoryCard) {
    this.spinner.show();
    this.OfferCategoryCardService.editOfferCategoryCardProduct(data).subscribe(
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

  private getAllPromotionalOffer() {
    this.promotionalOfferService.getAllPromotionalOffer().subscribe(
      (res) => {
        this.promotionalOffers = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
    }
  }
}
