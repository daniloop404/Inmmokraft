import { TestBed } from '@angular/core/testing';

import { TestPersonalidadService } from './test-personalidad.service';

describe('TestPersonalidadService', () => {
  let service: TestPersonalidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPersonalidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
