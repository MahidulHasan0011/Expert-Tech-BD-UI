import {Component, Input, OnInit} from '@angular/core';
import {Admin} from "../../../../interfaces/admin";
import {AdminService} from "../../../../services/admin.service";


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public userImage = 'assets/images/others/admin.jpg';

  @Input() admin: Admin;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.adminService.adminLogOut();
  }
}
