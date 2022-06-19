import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from './menu.component';
import {SidenavMenuComponent} from './sidenav-menu/sidenav-menu.component';
import {MenuLevelCatComponent} from './menu-level-cat/menu-level-cat.component';
import {StickyHeaderComponent} from './sticky-header/sticky-header.component';
import {RouterModule} from '@angular/router';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../material/material.module';



@NgModule({
  declarations: [
    MenuComponent,
    SidenavMenuComponent,
    MenuLevelCatComponent,
    StickyHeaderComponent
  ],
  exports: [
    MenuLevelCatComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    FlexLayoutModule,
    MaterialModule
  ]
})
export class MenuModule { }
