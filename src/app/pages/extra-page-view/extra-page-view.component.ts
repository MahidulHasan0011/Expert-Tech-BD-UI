import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShopService} from '../../services/shop.service';
import {PageInfo} from '../../interfaces/page-info';

@Component({
  selector: 'app-extra-page-view',
  templateUrl: './extra-page-view.component.html',
  styleUrls: ['./extra-page-view.component.scss']
})
export class ExtraPageViewComponent implements OnInit {

  slug: string = null;
  pageInfo: PageInfo = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });

  }


  private getPageInfo() {
    this.shopService.getPageInfoBySlug(this.slug)
      .subscribe(res => {
        this.pageInfo = res.data;
        console.log(this.pageInfo);
      }, error => {
        console.log(error);
      });
  }



}
