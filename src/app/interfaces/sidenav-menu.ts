export interface SidenavMenu {
  id: string;
  title: string;
  routerLink: string;
  href: string;
  hasSubMenu: boolean;
  parentId: string;
  target?: string;
}
