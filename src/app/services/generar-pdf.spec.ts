import { TestBed } from '@angular/core/testing';

import { GenerarPdf } from './generar-pdf';

describe('GenerarPdf', () => {
  let service: GenerarPdf;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarPdf);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
