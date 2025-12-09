import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PullToRefreshBannerComponent } from "./pull-to-refresh-banner.component";

describe("PullToRefreshBannerComponent", () => {
  let component: PullToRefreshBannerComponent;
  let fixture: ComponentFixture<PullToRefreshBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullToRefreshBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PullToRefreshBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
