import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavigationTabItemComponent } from "./step-item.component";

describe("NavigationTabItemComponent", () => {
  let component: NavigationTabItemComponent;
  let fixture: ComponentFixture<NavigationTabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationTabItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
