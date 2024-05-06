import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarTestComponent } from './modificar-test.component';

describe('ModificarTestComponent', () => {
  let component: ModificarTestComponent;
  let fixture: ComponentFixture<ModificarTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarTestComponent]
    });
    fixture = TestBed.createComponent(ModificarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
