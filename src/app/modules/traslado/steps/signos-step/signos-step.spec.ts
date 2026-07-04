import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignosStep } from './signos-step';

describe('SignosStep', () => {
  let component: SignosStep;
  let fixture: ComponentFixture<SignosStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignosStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignosStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
