import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesStep } from './antecedentes-step';

describe('AntecedentesStep', () => {
  let component: AntecedentesStep;
  let fixture: ComponentFixture<AntecedentesStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentesStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
