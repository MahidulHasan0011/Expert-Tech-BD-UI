import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProductService} from "../../../../../services/product.service";
import {UiService} from "../../../../../services/ui.service";
import {ReloadService} from "../../../../../services/reload.service";
import {FileUploadService} from "../../../../../services/file-upload.service";
import {Brand} from "../../../../../interfaces/brand";
import {FileData} from "../../../../../interfaces/file-data";


@Component({
  selector: 'app-author-dialog',
  templateUrl: './brand-dialog.component.html',
  styleUrls: ['./brand-dialog.component.scss']
})
export class BrandDialogComponent implements OnInit {

  private sub: Subscription;
  dataForm: FormGroup;

  autoSlug = true;
  isLoading = false;
  needAuthorEdit = false;

  brandName = new FormControl(null, {validators: [Validators.required]});
  slug = new FormControl(null, {validators: [Validators.required]});
  about = new FormControl(null);

  // Image Upload
  imgPlaceHolder = '/assets/images/icons/ic_user_low.svg';
  file: any = null;
  newFileName: string;


  constructor(
    public dialogRef: MatDialogRef<BrandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      brandName: this.brandName,
      slug: this.slug,
      about: this.about,
    });

    if (this.data.author !== null) {
      this.setFormValue();
    }

    this.autoGenerateSlug();

  }

  /**
   * ON SUBMIT
   */

  private setFormValue() {
    this.needAuthorEdit = true;
    this.dataForm.patchValue({
      authorName: this.data.author.brandName,
      slug: this.data.author.slug,
      about: this.data.author.about,
    });
    if (this.data.author.image !== null) {
      this.imgPlaceHolder = this.data.author.image;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    const data = {...this.dataForm.value, ...{image: null}};

    if (!this.needAuthorEdit) {
      if (this.file === null) {
        this.addNewAuthor(data);
      } else {
        this.addAuthorWithImage();
      }
    } else {
      const updateData = {...{_id: this.data.author._id}, ...{image: this.data.author.image}, ...this.dataForm.value};
      if (this.file === null) {
        this.editAuthor(updateData);
      } else {
        this.editAuthorWithImage();
      }
    }
  }


  /**
   * LOGICAL PART
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('brandName').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d.trim().replace(/\s+/g, '-').toLowerCase();
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

  /**
   * HTTP REQ HANDLE
   */

  private addNewAuthor(data: Brand) {
    this.isLoading = true;
    this.productService.addNewBrand(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAuthor$();
        this.isLoading = false;
        this.dialogRef.close();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  private editAuthor(updateData: Brand) {
    this.isLoading = true;
    this.productService.editBrand(updateData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAuthor$();
        this.isLoading = false;
        this.dialogRef.close();
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

    // Open Upload Dialog
    if (event.target.files[0]) {
      // console.log(this.file);
    }
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  addAuthorWithImage() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.file,
      folderPath: 'authors'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        // console.log(res.downloadUrl);
        const final = {...this.dataForm.value, ...{image: res.downloadUrl}};
        this.file = null;
        this.addNewAuthor(final);
      }, error => {
        console.log(error);
      });
  }

  editAuthorWithImage() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.file,
      folderPath: 'authors'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        // console.log(res);
        const final = {...{_id: this.data.author._id}, ...this.dataForm.value, ...{image: res.downloadUrl}};
        this.file = null;
        this.editAuthor(final);
      }, error => {
        console.log(error);
      });
  }


}
