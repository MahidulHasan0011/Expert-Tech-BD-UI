import {Component, OnInit} from '@angular/core';
import {PcBuild} from '../../interfaces/pc-build';
import {ReloadService} from '../../services/reload.service';
import {UiService} from '../../services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PcBuildService} from '../../services/pc-build.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContactInfo } from 'src/app/interfaces/contact-info';
import { ShopService } from 'src/app/services/shop.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pc-build',
  templateUrl: './pc-build.component.html',
  styleUrls: ['./pc-build.component.scss']
})
export class PcBuildComponent implements OnInit {

  pcBuildTools: PcBuild[] = [];

  contactInfoData: ContactInfo = null;

  constructor(
    private reloadService: ReloadService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    private pcBuildService: PcBuildService,
    private shopService: ShopService
  ) {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    this.reloadService.refreshPcBuild$.subscribe(() => {
      this.getPcBuildTools();
    });
    this.getPcBuildTools();
    this.getContactInfo();
  }

  private getContactInfo() {
    this.shopService.getContactInfo()
      .subscribe(res => {
        this.contactInfoData = res.data;
      }, error => {
        console.log(error);
      });
  }

  getPcBuildTools() {
    this.pcBuildTools = this.pcBuildService.getProductToBuildTools();
  }

  deleteProductToBuildToolsItem(componentId: string) {
    this.pcBuildService.deleteProductToBuildToolsItem(componentId);
    this.reloadService.needRefreshPcBuild$();
  }

  /**
   * CALCULATION
   */
  get totalSale(): number {
    return this.pcBuildTools.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }


  /**
   * ROUTER LINK
   */
  navigateTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route});
  }


  /**
   * PDF GENERATE
   * DOWNLOAD PDF
   * OPEN PDF
   */

  generateNewPdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinitionForPdf();

    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download('pc-build-by-roc.pdf');
        break;

      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }

  }


  getDocumentDefinitionForPdf() {
    return {
      content: [
        {
          text: 'RESUME',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },

        {
          text: 'Education',
          style: 'header'
        },
        this.getProductObject(),
      ],
      info: {
        title: 'Pc Build tools ROC.COM.BD',
        author: 'ROC.COM>BD',
        subject: 'PC BUILD',
        keywords: 'PC BUILD',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        name: {
          fontSize: 16,
          bold: true
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
          color: '#fff',
          background: '#040D21',
          margin: [0, 10, 0, 10],
        }
      }
    };
  }


  getProductObject() {
    return {
      table: {
        widths: ['*', 'auto', '*'],
        body: [
          [{
            text: 'Component',
            style: 'tableHeader'
          },
            {
              text: 'Name',
              style: 'tableHeader'
            },
            {
              text: 'Price',
              style: 'tableHeader'
            }
          ],
          ...this.pcBuildTools.map(m => {
            return [m.component, m.productName, m.price];
          })
        ]
      }
    };
  }


}
