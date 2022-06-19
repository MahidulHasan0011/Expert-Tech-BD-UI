import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInvoiceOneComponent } from './print-invoice-one.component';

describe('PrintInvoiceOneComponent', () => {
  let component: PrintInvoiceOneComponent;
  let fixture: ComponentFixture<PrintInvoiceOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInvoiceOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInvoiceOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

