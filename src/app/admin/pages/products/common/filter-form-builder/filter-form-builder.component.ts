import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from "../../../../../services/product.service";

export interface FormBuilderController {
  disable: boolean;
}

@Component({
  selector: 'app-filter-form-builder',
  templateUrl: './filter-form-builder.component.html',
  styleUrls: ['./filter-form-builder.component.scss']
})
export class FilterFormBuilderComponent implements OnInit {
  @Input() formDisabled: boolean;
  @Output() newItemEvent = new EventEmitter<any>();


  newFilterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
  }

  ngOnInit(): void {
    this.newFilterForm = this.fb.group({
      title: [null, Validators.required],
      components: this.fb.array([this.fb.group({key: ['', Validators.required]})])
    });

  }


  /**
   * FROM HERE
   */
  get componentKeys() {
    return this.newFilterForm.get('components') as FormArray;
  }

  addComponentKey() {
    this.componentKeys.push(this.fb.group({key: ['', Validators.required]}));
  }

  deleteComponentKey(index) {
    this.componentKeys.removeAt(index);
  }

  addNewItem(value: string) {
    this.newItemEvent.emit(value);
  }


}
