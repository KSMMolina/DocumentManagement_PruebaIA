import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdmonInfoCardComponent } from "./admon-info-card.component";

describe("AdmonInfoCardComponent", () => {
  let component: AdmonInfoCardComponent;
  let fixture: ComponentFixture<AdmonInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmonInfoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmonInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
