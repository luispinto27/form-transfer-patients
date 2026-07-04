import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteStep } from './paciente-step';

describe('PacienteStep', () => {
  let component: PacienteStep;
  let fixture: ComponentFixture<PacienteStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
