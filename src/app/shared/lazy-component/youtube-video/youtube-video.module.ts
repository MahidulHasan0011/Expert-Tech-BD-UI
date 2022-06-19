import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeVideoComponent } from './youtube-video.component';
import { RouterModule } from '@angular/router';
import {YouTubePlayerModule} from '@angular/youtube-player';



@NgModule({
  declarations: [YoutubeVideoComponent],
  imports: [
    CommonModule,
    RouterModule,
    YouTubePlayerModule
  ],
  exports: [
    YoutubeVideoComponent
  ]
})
export class YoutubeVideoModule { }
