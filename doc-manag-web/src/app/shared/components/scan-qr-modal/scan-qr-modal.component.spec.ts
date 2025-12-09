import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanQrModalComponent } from './scan-qr-modal.component';

describe('ScanQrModalComponent', () => {
  let component: ScanQrModalComponent;
  let fixture: ComponentFixture<ScanQrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanQrModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanQrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
