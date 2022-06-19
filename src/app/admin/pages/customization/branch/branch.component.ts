import {Component, OnInit} from '@angular/core';
import {ReloadService} from 'src/app/services/reload.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import {UiService} from 'src/app/services/ui.service';
import {AddNewBranchComponent} from './add-new-branch/add-new-branch.component';
import {Branch} from 'src/app/interfaces/branch';
import {ShopService} from 'src/app/services/shop.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {

  branches: Branch[] = [];

  constructor(
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private uiService: UiService,
    private shopService: ShopService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshBranch$.subscribe(() => {
      this.getBranchInfo();
    });

    this.getBranchInfo();
  }

  private getBranchInfo() {
    this.shopService.getBranchInfo().subscribe((res) => {
      this.branches = res.data;
    }, err => {
      console.log(err);
    });
  }

  openNewDialog(branch?: Branch) {
    this.dialog.open(AddNewBranchComponent, {
      data: branch,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }

  public openConfirmDialog(branchId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this branch?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteBranch(branchId);
        this.reloadService.needRefreshBranch$();
      }
    });
  }

  /**
   * HTTP Request Handle
   */

  deleteBranch(branchId: string) {
    this.shopService.deleteBranchInfoById(branchId)
      .subscribe( res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshBranch$();
      }, error => {
        console.log(error);
      });
  }

}
