import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../../../services/product.service';
import { UiService } from '../../../../../services/ui.service';
import { ReloadService } from '../../../../../services/reload.service';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { FeaturedCategory } from '../../../../../interfaces/featured-category';
import { FileData } from '../../../../../interfaces/file-data';

@Component({
  selector: 'app-featured-categories-dialog',
  templateUrl: './featured-categories-dialog.component.html',
  styleUrls: ['./featured-categories-dialog.component.scss'],
})
export class FeaturedCategoriesDialogComponent implements OnInit {
  private sub: Subscription;
  dataForm: FormGroup;

  autoSlug = true;
  isLoading = false;
  needAuthorEdit = false;

  featuredCategoryName = new FormControl(null, {
    validators: [Validators.required],
  });
  url = new FormControl(null, { validators: [Validators.required] });
  // about = new FormControl(null);

  // Image Upload
  imgPlaceHolder = '/assets/images/icons/ic_user_low.svg';
  file: any = null;
  newFileName: string;

  constructor(
    public dialogRef: MatDialogRef<FeaturedCategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.dataForm = new FormGroup({
      featuredCategoryName: this.featuredCategoryName,
      url: this.url,
      // about: this.about,
    });

    if (this.data.author !== null) {
      this.setFormValue();
    }

    // this.autoGenerateSlug();
  }

  /**
   * ON SUBMIT
   */

  private setFormValue() {
    this.needAuthorEdit = true;
    this.dataForm.patchValue({
      featuredCategoryName: this.data.author.featuredCategoryName,
      url: this.data.author.url,
      // about: this.data.author.about,
    });
    if (this.data.author.image !== null) {
      this.imgPlaceHolder = this.data.author.image;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    const data = { ...this.dataForm.value, ...{ image: null } };

    if (!this.needAuthorEdit) {
      if (this.file === null) {
        this.addNewFeaturedCategory(data);
      } else {
        this.addAuthorWithImage();
      }
    } else {
      const updateData = {
        ...{ _id: this.data.author._id },
        ...{ image: this.data.author.image },
        ...this.dataForm.value,
      };
      if (this.file === null) {
        this.editFeaturedCategory(updateData);
      } else {
        this.editAuthorWithImage();
      }
    }
  }

  /**
   * HTTP REQ HANDLE
   */

  private addNewFeaturedCategory(data: FeaturedCategory) {
    this.isLoading = true;
    this.productService.addNewFeaturedCategory(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshFeaturedCategory$();
        this.isLoading = false;
        this.dialogRef.close();
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  private editFeaturedCategory(updateData: FeaturedCategory) {
    this.isLoading = true;
    this.productService.editFeaturedCategory(updateData).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshFeaturedCategory$();
        this.isLoading = false;
        this.dialogRef.close();
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
      folderPath: 'featured-category',
    };
    this.fileUploadService.uploadSingleImage(data).subscribe(
      (res) => {
        // console.log(res.downloadUrl);
        const final = { ...this.dataForm.value, ...{ image: res.downloadUrl } };
        this.file = null;
        this.addNewFeaturedCategory(final);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editAuthorWithImage() {
    const data: FileData = {
      fileName: this.newFileName,
      file: this.file,
      folderPath: 'featured-category',
    };
    this.fileUploadService.uploadSingleImage(data).subscribe(
      (res) => {
        // console.log(res);
        const final = {
          ...{ _id: this.data.author._id },
          ...this.dataForm.value,
          ...{ image: res.downloadUrl },
        };
        this.file = null;
        this.editFeaturedCategory(final);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
