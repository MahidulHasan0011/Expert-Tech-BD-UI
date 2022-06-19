import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent implements OnInit {

  isLoaded = false;
  imageChangedEvent: any = null;
  croppedImage: any = null;
  imgBlob: any;
  fileBeforeCropped: any;


  constructor(
    public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.imageChangedEvent = this.data;
      console.log(this.imageChangedEvent);
    }
  }


  /**
   * Image Upload Area
   */



  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.fileBeforeCropped = this.imageChangedEvent.target.files[0];
    this.imgBlob = this.dataURItoBlob(this.croppedImage.split(',')[1]);
  }

  dataURItoBlob(dataURI: string) {
    if (isPlatformBrowser(this.platformId)) {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      return new Blob([int8Array], {type: 'image/jpeg'});
    }

  }

  loadImageFailed() {
    // this.matDialog.closeAll();
    this.isLoaded = false;
  }

  cropperReady() {
    this.isLoaded = true;
  }


  onCloseDialogue() {
    this.dialogRef.close();
  }

  onSaveImage() {
    this.dialogRef.close(
      {
      imgBlob: this.imgBlob ? this.imgBlob : null,
      croppedImage: this.croppedImage ? this.croppedImage : null
      }
    );
  }
}
