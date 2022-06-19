import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { sidenavMenuItems } from './sidenav-menu';
import {SidenavMenu} from '../../../interfaces/sidenav-menu';

@Injectable()
export class SidenavMenuService {

    constructor(private location: Location, private router: Router){ }



    expandActiveSubMenu(menu: SidenavMenu[]): void{
        const url = this.location.path();
        const routerLink = decodeURIComponent(url);
        const activeMenuItem = menu.filter(item => item.routerLink === routerLink);

        if (activeMenuItem[0]){
            let menuItem = activeMenuItem[0];
            while (menuItem.parentId !== '0'){
                const parentMenuItem = menu.filter(item => item.id === menuItem.parentId)[0];
                menuItem = parentMenuItem;
                this.toggleMenuItem(menuItem.id);
            }
        }
    }

    toggleMenuItem(menuId): void{
        const menuItem = document.getElementById('menu-item-' + menuId);
        const subMenu = document.getElementById('sub-menu-' + menuId);
        if (subMenu){
            if (subMenu.classList.contains('show')) {
                subMenu.classList.remove('show');
                menuItem.classList.remove('expanded');
            }
            else{
                subMenu.classList.add('show');
                menuItem.classList.add('expanded');
            }
        }
    }

   closeOtherSubMenus(menu: SidenavMenu[], menuId): void{
        const currentMenuItem = menu.filter(item => item.id === menuId)[0];
        menu.forEach(item => {
            if ((item.id !== menuId && item.parentId === currentMenuItem.parentId) || (currentMenuItem.parentId === '0' && item.id !== menuId) ){
                const subMenu = document.getElementById('sub-menu-' + item.id);
                const menuItem = document.getElementById('menu-item-' + item.id);
                if (subMenu){
                    if (subMenu.classList.contains('show')){
                        subMenu.classList.remove('show');
                        menuItem.classList.remove('expanded');
                    }
                }
            }
        });
    }

    public closeAllSubMenus(): void{
        sidenavMenuItems.forEach(item => {
            const subMenu = document.getElementById('sub-menu-' + item.id);
            const menuItem = document.getElementById('menu-item-' + item.id);
            if (subMenu){
                if (subMenu.classList.contains('show')){
                    subMenu.classList.remove('show');
                    menuItem.classList.remove('expanded');
                }
            }
        });
    }

}
