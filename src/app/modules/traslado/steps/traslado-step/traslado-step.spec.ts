import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasladoStep } from './traslado-step';

describe('TrasladoStep', () => {
  let component: TrasladoStep;
  let fixture: ComponentFixture<TrasladoStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrasladoStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrasladoStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
