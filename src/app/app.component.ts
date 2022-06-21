import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';
import {isPlatformBrowser, registerLocaleData} from '@angular/common';
import localeBn from '@angular/common/locales/bn';
import {UserService} from './services/user.service';
import {AdminService} from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {


  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private userService: UserService,
    private adminService: AdminService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    registerLocaleData(localeBn, 'bn');
    this.userService.autoUserLoggedIn();
    this.adminService.autoAdminLoggedIn();
  }

  ngOnInit() {
    // Facebook Script
    // if (isPlatformBrowser(this.platformId)) {
    //   const tag = document.createElement('script');
    //   tag.src = 'https://connect.facebook.net/en_US/sdk.js';
    //   document.body.appendChild(tag);
    // }
    this.updateMetaData();
  }

  private updateMetaData() {
    // Title
    this.title.setTitle('Expert Tech BD | Best Online Shop for Tech Gadgets');

    // Meta
    this.meta.addTag({name: 'author', content: 'Expert Tech BD'});
    this.meta.addTag({name: 'author', content: 'Expert Tech BD'});
    this.meta.addTag({name: 'copyright', content: 'Expert Tech BD'});
    this.meta.addTag({name: 'og:locale', content: 'en_US'});
    // Open Graph
    this.meta.addTag({name: 'og:site_name', content: 'Expert Tech BD'});
    // Twitter
    this.meta.addTag({name: 'twitter:card', content: 'Expert Tech BD'});
    // this.meta.addTag({
    //   name: 'twitter:site',
    //   content: 'https://experttechbd.com.bd/',
    // });
    // this.meta.addTag({
    //   name: 'twitter:creator',
    //   content: 'https://experttechbd.com.bd/',
    // });
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      }
    });
  }


}
