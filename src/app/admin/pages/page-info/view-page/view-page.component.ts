import { Component, OnInit } from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PageInfo} from "../../../../interfaces/page-info";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";


@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {

  editorConfigDesc: AngularEditorConfig = {
    editable: true,
    minHeight: '250px',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter/Copy product descriptions...',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'italic',
        'strikeThrough',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'fontName'
      ],
      [
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
      ]
    ]
  };

  slug: string = null;
  pageInfo: PageInfo = null;
  // Form Data
  dataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private shopService: ShopService,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.pageInfo);
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Plaese complete required fields');
      return;
    }
    this.addPageInfo();
  }

  /**
   * HTTP REQ HANDLE
   */

  private addPageInfo() {
    let finalData;
    if (this.pageInfo) {
      finalData = {...this.dataForm.value, ...{slug: this.slug, _id: this.pageInfo._id}};
    } else {
      finalData = {...this.dataForm.value, ...{slug: this.slug}};
    }
    this.shopService.addPageInfo(finalData)
      .subscribe(res => {
       this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }

  private getPageInfo() {
    this.shopService.getPageInfoBySlug(this.slug)
      .subscribe(res => {
        this.pageInfo = res.data;
        if (this.pageInfo) {
          this.setFormData();
        }
        console.log(this.pageInfo);
      }, error => {
        console.log(error);
      });
  }



}
