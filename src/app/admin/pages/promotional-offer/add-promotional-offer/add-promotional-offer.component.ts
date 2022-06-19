import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {PromotionalOffer} from "../../../../interfaces/promotional-offer";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../../../../services/ui.service";
import {UtilsService} from "../../../../services/utils.service";
import {StorageService} from "../../../../services/storage.service";
import {NgxSpinnerService} from "ngx-spinner";
import {PromotionalOfferService} from "../../../../services/promotional-offer.service";

class TextEditorCtrService {
}

@Component({
  selector: 'app-add-promotional-offer',
  templateUrl: './add-promotional-offer.component.html',
  styleUrls: ['./add-promotional-offer.component.scss']
})
export class AddPromotionalOfferComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  promotionalOffer: PromotionalOffer;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  editorConfigDesc: AngularEditorConfig = {
    editable: true,
    minHeight: '250px',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter/Copy product descriptions...',
    sanitize: true,
    toolbarPosition: 'top',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
  };

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
    // public textEditorCtrService: TextEditorCtrService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      slug: [null, Validators.required],
      shortDescription: [null],
      description: [null],
      image: [null],
      campaignStartDate: [null],
      campaignStartTime: [null],
      campaignEndDate: [null],
      campaignEndTime: [null],
    });

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT'));
      }

      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.dataForm.patchValue(
          {image: this.pickedImage}
        );
      }
    }
    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSinglePromotionalOfferById();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.promotionalOffer);

    if (this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('PROMOTIONAL_OFFER_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.promotionalOffer.image ? this.promotionalOffer.image : this.placeholder;
    }
  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('title').valueChanges
        .pipe(
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
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

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    const rawData = this.dataForm.value;
    const mData = {
      campaignStartDate: rawData.campaignStartDate ? this.utilsService.getDateString(rawData.campaignStartDate) : null,
      campaignEndDate: rawData.campaignEndDate ? this.utilsService.getDateString(rawData.campaignEndDate) : null,
    };
    const finalData = {
      ...rawData,
      ...mData
    };
    if (this.promotionalOffer) {
      const mEditData = {...finalData, ...{_id: this.promotionalOffer._id}};
      this.editPromotionalOfferData(mEditData);
    } else {
      console.log(this.dataForm.value);
      this.addNewPromotionalOffer(finalData);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */
  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'PROMOTIONAL_OFFER_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewPromotionalOffer(data: PromotionalOffer) {
    this.spinner.show();
    this.promotionalOfferService.addNewPromotionalOffer(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
        this.pickedImage = this.placeholder;
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private getSinglePromotionalOfferById() {
    this.spinner.show();
    this.promotionalOfferService.getSinglePromotionalOfferById(this.id)
      .subscribe(res => {
        this.promotionalOffer = res.data;
        if (this.promotionalOffer) {
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private editPromotionalOfferData(data: PromotionalOffer) {
    this.spinner.show();
    this.promotionalOfferService.editPromotionalOfferData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
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
