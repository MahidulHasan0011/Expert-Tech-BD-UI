import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {UtilsService} from '../../../services/utils.service';

@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.scss']
})
export class YoutubeVideoComponent implements OnInit {

  @Input() product: Product = null;

  constructor(
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
  }

}
