import {Component, Input, OnInit} from '@angular/core';
import {ContactInfo} from '../../../interfaces/contact-info';
import {ShopService} from 'src/app/services/shop.service';
import { Branch } from 'src/app/interfaces/branch';

@Component({
  selector: 'app-footer-new',
  templateUrl: './footer-new.component.html',
  styleUrls: ['./footer-new.component.scss']
})
export class FooterNewComponent implements OnInit {

  @Input() contactInfo: ContactInfo = null;
  @Input() addressLines: string[] = [];
  branches: Branch[] = [];

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit(): void {

    this.shopService.getBranchInfo()
    .subscribe( res => {
      console.log(res);
      this.branches = res.data;
    }, error => {
      console.log(error);
    });

  }

}
