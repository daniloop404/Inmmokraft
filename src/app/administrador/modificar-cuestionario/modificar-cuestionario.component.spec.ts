import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCuestionarioComponent } from './modificar-cuestionario.component';

describe('ModificarCuestionarioComponent', () => {
  let component: ModificarCuestionarioComponent;
  let fixture: ComponentFixture<ModificarCuestionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarCuestionarioComponent]
    });
    fixture = TestBed.createComponent(ModificarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
