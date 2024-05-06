import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPersonalidadComponent } from './test-personalidad.component';

describe('TestPersonalidadComponent', () => {
  let component: TestPersonalidadComponent;
  let fixture: ComponentFixture<TestPersonalidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestPersonalidadComponent]
    });
    fixture = TestBed.createComponent(TestPersonalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
