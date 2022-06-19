import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MenuService} from '../../../services/menu.service';

@Component({
  selector: 'app-menu-level-cat',
  templateUrl: './menu-level-cat.component.html',
  styleUrls: ['./menu-level-cat.component.scss']
})
export class MenuLevelCatComponent implements OnInit {

  @Input()
  menu: any = null;
  isOpen = false;


  constructor(
    private router: Router,
    private menuService: MenuService,
  ) {
  }

  ngOnInit(): void {
  }

  clickParent(event: MouseEvent, menu: any) {
    this.isOpen = !this.isOpen;

    if (menu.depth === 3) {
      this.router.navigate([menu.routerLink], {queryParams: {page: 1}});
      this.menuService.needRefreshMenu$();
    } else if (menu.depth === 2 && menu.hasChild.length <= 0) {
      this.router.navigate([menu.routerLink], {queryParams: {page: 1}});
      this.menuService.needRefreshMenu$();
    } else if (menu.depth === 1 && menu.hasChild.length <= 0) {
      this.router.navigate([menu.routerLink], {queryParams: {page: 1}});
      this.menuService.needRefreshMenu$();
    } else {
      console.log('Nothing');
    }
  }

  getClass(depth: number) {
    switch (depth) {
      case 1:
        return 'depth-1';

      case 2:
        return 'depth-2';

      case 3:
        return 'depth-3';

      default:
        return ''
    }
  }
}
