import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastoStep } from './gasto-step';

describe('GastoStep', () => {
  let component: GastoStep;
  let fixture: ComponentFixture<GastoStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastoStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastoStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
