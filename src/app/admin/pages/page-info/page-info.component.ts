import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-info',
  templateUrl: './page-info.component.html',
  styleUrls: ['./page-info.component.scss']
})
export class PageInfoComponent implements OnInit {

  allPages: object[] = [
    {_id: 1, name: 'About Us', slug: 'about-us'},
    {_id: 2, name: 'Contact Us', slug: 'contact-us'},
    {_id: 3, name: 'Terms and Condition', slug: 'terms-and-conditions'},
    {_id: 4, name: 'Privacy Policy', slug: 'privacy-policy'},
    {_id: 5, name: 'Refund and Return Policy', slug: 'refund-and-return-policy'},
    {_id: 6, name: 'Online Delivery', slug: 'online-delivery'},
    {_id: 7, name: 'Accessories Deals', slug: 'accessories-deals'},
    {_id: 8, name: 'Monitor Deals', slug: 'monitor-deals'},
    {_id: 9, name: 'EMI Terms', slug: 'emi-terms'},
    {_id: 10, name: 'Career', slug: 'career'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
