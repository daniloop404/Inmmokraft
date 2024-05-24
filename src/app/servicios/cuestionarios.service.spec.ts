import { TestBed } from '@angular/core/testing';

import { CuestionariosService } from '../servicios/cuestionarios.service';

describe('CuestionariosService', () => {
  let service: CuestionariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuestionariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
