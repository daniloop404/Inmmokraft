import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-test',
  templateUrl: './modificar-test.component.html',
  styleUrls: ['./modificar-test.component.css']
})
export class ModificarTestComponent implements OnInit {
  testPersonalidadForm: FormGroup;
  testGuardado: boolean = false;
  opcionesTexto = ['En desacuerdo totalmente (1)', 'En desacuerdo (2)', 'Ni en desacuerdo ni en acuerdo (3)', 'En acuerdo (4)', 'En total acuerdo (5)'];
  puntajeTotal: number;
  testId: string;

  constructor(
    private formBuilder: FormBuilder,
    private testPersonalidadService: TestPersonalidadService,
    private route: ActivatedRoute
  ) {
    this.testPersonalidadForm = this.formBuilder.group({
      nombreTest: ['', Validators.required],
      categoria: ['', Validators.required],
      preguntas: this.formBuilder.array([]),
      rangosPuntaje: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.fetchTestPersonalidad();
  }

  fetchTestPersonalidad() {
    this.testPersonalidadService.getTestPersonalidadById(this.testId).subscribe(
      (testPersonalidad) => {
        this.initializeForm(testPersonalidad);
      },
      (error) => {
        console.error('Error al obtener el Test de Personalidad:', error);
      }
    );
  }

  initializeForm(testPersonalidad: any) {
    this.testPersonalidadForm.patchValue({
      nombreTest: testPersonalidad.nombreTest,
      categoria: testPersonalidad.categoria
    });

    const preguntas = testPersonalidad.preguntas.map((pregunta) => this.createPreguntaGroup(pregunta));
    this.testPersonalidadForm.setControl('preguntas', this.formBuilder.array(preguntas));

    const rangosPuntaje = testPersonalidad.rangosPuntaje.map((rango) => this.createRangoGroup(rango));
    this.testPersonalidadForm.setControl('rangosPuntaje', this.formBuilder.array(rangosPuntaje));
  }

  createPreguntaGroup(pregunta: any) {
    return this.formBuilder.group({
      textoPregunta: [pregunta.textoPregunta, Validators.required],
      opciones: this.formBuilder.array([
        this.createOpcion(),
        this.createOpcion(),
        this.createOpcion(),
        this.createOpcion(),
        this.createOpcion()
      ])
    });
  }

  createOpcion() {
    return this.formBuilder.group({
      opcion: [null]
    });
  }

  createRangoGroup(rango: any) {
    return this.formBuilder.group({
      rangoMenor: [rango.rangoMenor, Validators.required],
      rangoMayor: [rango.rangoMayor, Validators.required],
      resultado: [rango.resultado, Validators.required]
    });
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

  deletePregunta(index: number) {
    this.preguntas.removeAt(index);
    this.puntajeTotal = this.preguntas.length * 5;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      console.error('Por favor complete todos los campos obligatorios.');
      return;
    }
    const confirmacion = confirm('¿Está seguro de que desea modificar el Test de Personalidad?');
    if (confirmacion) {
      const testModificado = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };

      this.testPersonalidadService.updateTestPersonalidad(this.testId, testModificado).subscribe(
        (response) => {
          console.log('Test de Personalidad modificado exitosamente:', response);
          this.testGuardado = true;
          setTimeout(() => {
            this.testGuardado = false;
          }, 3000);
        },
        (error) => {
          console.error('Error al modificar el Test de Personalidad:', error);
        }
      );
    } else {
      console.log('El Test de Personalidad no fue modificado.');
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