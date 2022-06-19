import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageGalleryDialogComponent } from './image-gallery-dialog.component';

const routes: Routes = [
  {path: '', component: ImageGalleryDialogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageGalleryRoutingModule { }
