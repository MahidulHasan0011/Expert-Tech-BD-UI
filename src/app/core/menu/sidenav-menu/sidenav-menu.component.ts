import {Component, Input, OnInit} from '@angular/core';
import {SidenavMenu} from '../../../interfaces/sidenav-menu';
import {SidenavMenuService} from './sidenav-menu.service';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss']
})
export class SidenavMenuComponent implements OnInit {

  @Input('menuItems') menuItems: SidenavMenu[];
  @Input('menuParentId') menuParentId;

  parentMenu: SidenavMenu[];

  constructor(
    private sidenavMenuService: SidenavMenuService
  ) { }

  ngOnInit(): void {
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }

  onClick(menuId): void{
    this.sidenavMenuService.toggleMenuItem(menuId);
    this.sidenavMenuService.closeOtherSubMenus(this.menuItems, menuId);
  }

}
