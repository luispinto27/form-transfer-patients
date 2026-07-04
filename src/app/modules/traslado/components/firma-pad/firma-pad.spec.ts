import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaPad } from './firma-pad';

describe('FirmaPad', () => {
  let component: FirmaPad;
  let fixture: ComponentFixture<FirmaPad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmaPad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmaPad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
