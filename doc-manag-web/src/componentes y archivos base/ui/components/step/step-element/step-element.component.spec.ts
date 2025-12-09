import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StepElementComponent } from "./step-element.component";

describe("StepElementComponent", () => {
  let component: StepElementComponent;
  let fixture: ComponentFixture<StepElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepElementComponent);
    component = fixture.componentInstance; 
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
