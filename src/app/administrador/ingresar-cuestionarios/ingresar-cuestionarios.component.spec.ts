import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarCuestionariosComponent } from './ingresar-cuestionarios.component';

describe('IngresarCuestionariosComponent', () => {
  let component: IngresarCuestionariosComponent;
  let fixture: ComponentFixture<IngresarCuestionariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresarCuestionariosComponent]
    });
    fixture = TestBed.createComponent(IngresarCuestionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
