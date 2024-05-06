import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarTestpersonalidadComponent } from './ingresar-testpersonalidad.component';

describe('IngresarTestpersonalidadComponent', () => {
  let component: IngresarTestpersonalidadComponent;
  let fixture: ComponentFixture<IngresarTestpersonalidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresarTestpersonalidadComponent]
    });
    fixture = TestBed.createComponent(IngresarTestpersonalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
