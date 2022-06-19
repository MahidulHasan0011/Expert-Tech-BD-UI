import {Component, Input, OnInit} from '@angular/core';
import {MenuAdmin} from '../../../../interfaces/menu-admin';
import {MenuCtrService} from '../../../../services/menu-ctr.service';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Input() public navItem;
  @Input() menuItems: MenuAdmin[];
  @Input() menuParentId: string = null;

  parentMenu: MenuAdmin[] = [];


  constructor(
    private menuCtrService: MenuCtrService
  ) {
  }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }

  onClick(menuId) {
    console.log(menuId);
    this.menuCtrService.toggleMenuItemAdmin(menuId);
    this.menuCtrService.closeOtherSubMenusAdmin(this.menuItems, menuId);
  }


  sideLinkClick() {
    if (window.innerWidth > 599) {
      this.navItem.open();
    } else {
      this.navItem.close();
    }
  }

}
