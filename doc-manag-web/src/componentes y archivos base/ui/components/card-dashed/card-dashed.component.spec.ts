import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDashedComponent } from './card-dashed.component';

describe('CardDashedComponent', () => {
  let component: CardDashedComponent;
  let fixture: ComponentFixture<CardDashedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDashedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDashedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
