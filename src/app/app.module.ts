import { NgModule } from '@angular/core';
import {BrowserModule, Meta, Title} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PagesComponent} from './pages/pages.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {FooterNewComponent} from './shared/components/footer-new/footer-new.component';
import {FooterStickyComponent} from './shared/components/footer-sticky/footer-sticky.component';
import {SharedModule} from './shared/shared.module';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {PipesModule} from './shared/pipes/pipes.module';
import {MaterialModule} from './material/material.module';
import {MenuModule} from './core/menu/menu.module';
import {SidenavMenuService} from './core/menu/sidenav-menu/sidenav-menu.service';
import {Overlay, OverlayContainer} from '@angular/cdk/overlay';
import {menuScrollStrategy} from './core/utils/scroll-strategy';
import {CustomOverlayContainer} from './core/utils/custom-overlay-container';
import {MAT_MENU_SCROLL_STRATEGY} from '@angular/material/menu';
import {ErrorHandleInterceptor} from './error-handler/error-handle.interceptor';
import {AuthUserInterceptor} from './auth-interceptor/auth-user.interceptor';
import {AuthAdminInterceptor} from './auth-interceptor/auth-admin.interceptor';
import {AppSettings} from './app.settings';
import {AppService} from './app.service';
import { FacebookModule } from 'ngx-facebook';

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    FooterNewComponent,
    FooterStickyComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    // Angular Firebase Config
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    PipesModule,
    MaterialModule,
    MenuModule,
    // Ngx Facebook
    FacebookModule.forRoot()
  ],
  providers: [
    Title,
    Meta,
    SidenavMenuService,
    AppSettings,
    AppService,
    {provide: OverlayContainer, useClass: CustomOverlayContainer},
    {provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay]},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandleInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthUserInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthAdminInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
