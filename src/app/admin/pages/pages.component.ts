import {AfterViewInit, Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Meta} from '@angular/platform-browser';
import {MenuAdmin} from '../../interfaces/menu-admin';
import {menuItemsAdmin} from '../../core/utils/admin-menu';
import {MenuCtrService} from '../../services/menu-ctr.service';
import {AdminService} from '../../services/admin.service';
import {AdminRoleEnum} from '../../enum/admin-role.enum';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, AfterViewInit {

  @Output() @ViewChild('sidenav', {static: true}) theSidenav;
  @Input() isAdminMenu = false;
  @Input() sideNavMenuList: any[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  isMidDevice$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  // Store Data
  menuList: MenuAdmin[] = [];


  constructor(
    private breakpointObserver: BreakpointObserver,
    private meta: Meta,
    private menuCtrService: MenuCtrService,
    private adminService: AdminService,
  ) {
  }

  ngOnInit() {
    // Google No Index
    this.googleNoIndex();


    if (this.adminService.getAdminRole() === AdminRoleEnum.SUPER_ADMIN) {
      this.menuList = menuItemsAdmin;
    }

    switch (this.adminService.getAdminRole()) {
      case AdminRoleEnum.SUPER_ADMIN: {
        this.menuList = menuItemsAdmin;
        break;
      }
      case AdminRoleEnum.ADMIN: {
        this.menuList = menuItemsAdmin;
        break;
      }
      case AdminRoleEnum.EDITOR: {
        this.menuList = menuItemsAdmin;
        break;
      }
      default: {
        this.menuList = menuItemsAdmin;
        break;
      }
    }
    // this.menuList = menuItemsAdmin;
  }

  ngAfterViewInit(): void {
    this.menuCtrService.expandActiveSubMenuAdmin(this.menuList);
  }

  //
  // ngAfterViewInit() {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.sidenav.close();
  //     }
  //   });
  //   this.menuCtrService.expandActiveSubMenu(this.menus);
  // }
  //


  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({name: 'robots', content: 'noindex'});
    this.meta.updateTag({name: 'googlebot', content: 'noindex'});
  }

}
