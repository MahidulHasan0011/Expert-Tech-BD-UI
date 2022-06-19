import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'EXPERT_TECH_BD_TOKEN_' + environment.VERSION,
  loggInSession: 'EXPERT_TECH_BD_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'EXPERT_TECH_BD_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'EXPERT_TECH_BD_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'EXPERT_TECH_BD_USER_0_' + environment.VERSION,
  cartsProduct: 'EXPERT_TECH_BD_USER_CART_' + environment.VERSION,
  adminRoleData: 'EXPERT_TECH_BD_ADMIN_ROLE_' + environment.VERSION,
  productFormData: 'EXPERT_TECH_BD_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'EXPERT_TECH_BD_USER_CART_' + environment.VERSION,
});
