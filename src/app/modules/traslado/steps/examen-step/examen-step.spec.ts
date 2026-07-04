import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenStep } from './examen-step';

describe('ExamenStep', () => {
  let component: ExamenStep;
  let fixture: ComponentFixture<ExamenStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
