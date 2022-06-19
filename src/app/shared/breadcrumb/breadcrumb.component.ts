import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, UrlSegment} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {SidenavMenuService} from '../../core/menu/sidenav-menu/sidenav-menu.service';
import {AppSettings} from '../../app.settings';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  providers: [SidenavMenuService]
})
export class BreadcrumbComponent {

  public pageTitle: string;
  public breadcrumbs: { name: string; url: string }[] = [];

  //  public settings: Settings;

  constructor(public appSettings: AppSettings,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public title: Title,
              public sidenavMenuService: SidenavMenuService,
              @Inject(PLATFORM_ID) public platformId: any
  ) {
    // this.settings = this.appSettings.settings;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = [];
        this.parseRoute(this.router.routerState.snapshot.root);
        this.pageTitle = '';
        this.breadcrumbs.forEach(breadcrumb => {
          this.pageTitle += ' > ' + breadcrumb.name;
        });
        // this.title.setTitle(this.settings.name + this.pageTitle);
      }
    });
  }

  private parseRoute(node: ActivatedRouteSnapshot) {
    if (node.data['breadcrumb']) {
      if (node.url.length) {
        let urlSegments: UrlSegment[] = [];
        node.pathFromRoot.forEach(routerState => {
          urlSegments = urlSegments.concat(routerState.url);
        });
        let url = urlSegments.map(urlSegment => {
          return urlSegment.path;
        }).join('/');

        if (node.params.name) {
          this.breadcrumbs.push({
            name: node.params.name,
            url: '/' + url
          });
        } else {
          this.breadcrumbs.push({
            name: node.data['breadcrumb'],
            url: '/' + url
          });
        }
      }
    }
    if (node.firstChild) {
      this.parseRoute(node.firstChild);
    }
  }

  public closeSubMenus() {

    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 960) {
        this.sidenavMenuService.closeAllSubMenus();
      }
    }
  }

}
