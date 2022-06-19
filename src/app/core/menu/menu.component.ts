import {Component, OnInit} from '@angular/core';
import {ShopService} from '../../services/shop.service';
import {Menu} from '../../interfaces/menu';
import {PromotionalOfferService} from "../../services/promotional-offer.service";
import {PromotionalOffer} from "../../interfaces/promotional-offer";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menuList: Menu[] = [];

  constructor(
    private shopService: ShopService
  ) {
  }

  ngOnInit(): void {
    this.getAllMenu();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllMenu() {
    this.shopService.getAllMenu()
      .subscribe(res => {
        // console.log(res);
        this.menuList = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * HTTP REQ HANDLE
   */


}
