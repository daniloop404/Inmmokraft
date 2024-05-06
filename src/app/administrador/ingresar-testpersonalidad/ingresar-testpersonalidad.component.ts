import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';

@Component({
  selector: 'app-ingresar-testpersonalidad',
  templateUrl: './ingresar-testpersonalidad.component.html',
  styleUrls: ['./ingresar-testpersonalidad.component.css']
})
export class IngresarTestpersonalidadComponent {
  testPersonalidadForm: FormGroup;
  testGuardado: boolean = false;
  opcionesTexto = ['En desacuerdo totalmente (1)', 'En desacuerdo (2)', 'Ni en desacuerdo ni en acuerdo (3)', 'En acuerdo (4)', 'En total acuerdo (5)'];
  puntajeTotal: number;

  constructor(private formBuilder: FormBuilder, private testPersonalidadService: TestPersonalidadService) {
    this.testPersonalidadForm = this.formBuilder.group({
      nombreTest: ['', Validators.required],
      categoria: ['', Validators.required],
      preguntas: this.formBuilder.array([]),
      rangosPuntaje: this.formBuilder.array([])
  });

    this.addPregunta();
    this.puntajeTotal = this.preguntas.length * 5;
  }

  get preguntas() {
    return this.testPersonalidadForm.get('preguntas') as FormArray;
  }

  addPregunta() {
    const pregunta = this.formBuilder.group({
      textoPregunta: ['', Validators.required],
      opciones: this.formBuilder.array([
        this.createOpcion(),
        this.createOpcion(),
        this.createOpcion(),
        this.createOpcion(),
        this.createOpcion()
      ])
    });

    this.preguntas.push(pregunta);
    this.puntajeTotal = this.preguntas.length * 5;
  }

  createOpcion() {
    return this.formBuilder.group({
      opcion: [null]
    });
  }

  deletePregunta(index: number) {
    this.preguntas.removeAt(index);
    this.puntajeTotal = this.preguntas.length * 5;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      console.error('Por favor complete todos los campos obligatorios.');
      return;
    }

    const confirmacion = confirm('¿Está seguro de que desea guardar el Test de Personalidad?');
    if (confirmacion) {
      const nuevoTest = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };

      this.testPersonalidadService.postTestPersonalidad(nuevoTest).subscribe(
        (response) => {
          console.log('Test de Personalidad guardado exitosamente:', response);
          this.testGuardado = true;
          setTimeout(() => {
            this.testPersonalidadForm.reset();
            this.addPregunta();
            this.testGuardado = false;
          }, 3000);
        },
        (error) => {
          console.error('Error al guardar el Test de Personalidad:', error);
        }
      );
    } else {
      console.log('El Test de Personalidad no fue guardado.');
    }
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  isFormValid(): boolean {
    if (this.testPersonalidadForm.invalid) {
      return false;
    }

    const controls = this.testPersonalidadForm.controls;
    for (const field in controls) {
      if (controls[field].invalid) {
        return false;
      }
    }

    const preguntas = this.preguntas.controls;
    for (const pregunta of preguntas) {
      if (pregunta.invalid) {
        return false;
      }
    }

    return true;
  }
  get rangosPuntaje() {
    return this.testPersonalidadForm.get('rangosPuntaje') as FormArray;
}

addRango() {
    const rango = this.formBuilder.group({
        rangoMenor: [null, Validators.required],
        rangoMayor: [null, Validators.required],
        resultado: [null, Validators.required]
    });
    this.rangosPuntaje.push(rango);
}

deleteRango(index: number) {
    this.rangosPuntaje.removeAt(index);
}
  


}
