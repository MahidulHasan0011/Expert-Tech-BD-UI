import {Menu} from './menu.model';

export const menuItems = [
  new Menu(10, 'Dashboard', '/admin', null, 'dashboard', null, false, 0),
  new Menu(100, 'Main Menu', '/admin/main-menu', null, 'follow_the_signs', null, false, 0),

  new Menu(101, 'Customization', null, null, 'follow_the_signs', null, true, 0),
  new Menu(102, 'Carousel', '/admin/customization/primary-carousel', null, 'category', null, false, 101),
  new Menu(103, 'Offer Tabs', '/admin/customization/offer-tabs', null, 'category', null, false, 101),
  new Menu(103, 'Offer Banner', '/admin/customization/offer-banner', null, 'category', null, false, 101),
  new Menu(103, 'Contact Info', '/admin/customization/contact-info', null, 'category', null, false, 101),
  new Menu(103, 'Branch Info', '/admin/customization/branch', null, 'category', null, false, 101),

  new Menu(20, 'Products', null, null, 'grid_on', null, true, 0),
  new Menu(21, 'Categories', '/admin/products/categories', null, 'category', null, false, 20),
  new Menu(226, 'Sub Categories', '/admin/products/sub-categories', null, 'loyalty', null, false, 20),
  new Menu(225, 'Brands', '/admin/products/authors', null, 'supervised_user_circle', null, false, 20),

  new Menu(60, 'All Pages', '/admin/pages-info', null, 'card_giftcard', null, false, 0),

  new Menu(22, 'Products List', '/admin/products/product-list', null, 'list', null, false, 20),
  new Menu(23, 'Offer Product', '/admin/products/offer-product', null, 'remove_red_eye', null, false, 20),
  new Menu(23, 'Offer Package', '/admin/products/offer-package', null, 'remove_red_eye', null, false, 20),
  // new Menu(23, 'Product Detail', '/admin/products/product-detail', null, 'remove_red_eye', null, false, 20),
  new Menu(24, 'Add Product', '/admin/products/add-product', null, 'add_circle_outline', null, false, 20),
  new Menu(30, 'Sales', null, null, 'monetization_on', null, true, 0),
  new Menu(31, 'Orders', '/admin/sales/orders', null, 'list_alt', null, false, 30),
  new Menu(32, 'Transactions', '/admin/sales/transactions', null, 'local_atm', null, false, 30),
  new Menu(120, 'Shipping Charge', '/admin/shipping-charge', null, 'insert_comment', null, false, 0),
  new Menu(40, 'Users', '/admin/users', null, 'group_add', null, false, 0),
  new Menu(50, 'Customers', '/admin/customers', null, 'supervisor_account', null, false, 0),
  new Menu(60, 'Coupons', '/admin/coupons', null, 'card_giftcard', null, false, 0),
  // new Menu(90, 'Refund', '/admin/refund', null, 'restore', null, false, 0),
  new Menu(120, 'Reviews', '/admin/reviews', null, 'insert_comment', null, false, 0),
  new Menu(120, 'Roles', '/admin/roles', null, 'insert_comment', null, false, 0),
  new Menu(120, ' Newsletter', '/admin/newsletter', null, 'insert_comment', null, false, 0),
  new Menu(110, 'Support', null,  'https://softlabit.com/', 'support', '_blank', false, 0),

];
