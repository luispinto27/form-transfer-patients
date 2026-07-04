import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmasStep } from './firmas-step';

describe('FirmasStep', () => {
  let component: FirmasStep;
  let fixture: ComponentFixture<FirmasStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmasStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmasStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
