import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';

@Component({
  selector: 'app-ingresar-testpersonalidad',
  templateUrl: './ingresar-testpersonalidad.component.html',
  styleUrls: ['./ingresar-testpersonalidad.component.css']
})
export class IngresarTestpersonalidadComponent {
  testPersonalidadForm: FormGroup;
  testGuardado: boolean = false;
  puntajeTotal: number;
  imagePreviews: string[] = [];
  portadaPreview: string | null = null;

  constructor(private formBuilder: FormBuilder, private testPersonalidadService: TestPersonalidadService) {
    this.testPersonalidadForm = this.formBuilder.group({
      nombreTest: ['', Validators.required],
      categoria: ['', Validators.required],
      portada: [null],
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
        this.createOpcion()
      ]),
      imagenPregunta: ['']
    });

    this.preguntas.push(pregunta);
    this.puntajeTotal = this.preguntas.length * 5;
  }

  createOpcion() {
    return this.formBuilder.group({
      textoOpcion: ['', Validators.required],
      puntaje: [null, Validators.required]
    });
  }

  deletePregunta(index: number) {
    this.preguntas.removeAt(index);
    this.puntajeTotal = this.preguntas.length * 5;
  }

  async onSubmit() {
    if (!this.isFormValid()) {
        return; // Detiene la ejecución si el formulario no es válido
    }

    const confirmacion = confirm('¿Está seguro de que desea guardar el Test de Personalidad?');
    if (confirmacion) {
      const nuevoTest = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };

      const uploads = [];
      for (let i = 0; i < nuevoTest.preguntas.length; i++) {
        const pregunta = nuevoTest.preguntas[i];
        if (pregunta.imagenPregunta) {
          const file = pregunta.imagenPregunta;
          const uploadTask = this.testPersonalidadService.uploadImage(file).then(url => {
            pregunta.imagenPregunta = url;
          });
          uploads.push(uploadTask);
        }
      }

      if (nuevoTest.portada) {
        const portadaFile = nuevoTest.portada;
        const uploadPortadaTask = this.testPersonalidadService.uploadImage(portadaFile).then(url => {
          nuevoTest.portada = url;
        });
        uploads.push(uploadPortadaTask);
      }

      try {
        await Promise.all(uploads);

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
      } catch (error) {
        console.error('Error al cargar imágenes:', error);
      }
    } else {
      console.log('El Test de Personalidad no fue guardado.');
    }
  }

  isFormValid(): boolean {
    if (this.testPersonalidadForm.invalid) {
        return false;
    }

    const preguntas = this.preguntas.controls;
    for (const pregunta of preguntas) {
        const opciones = pregunta.get('opciones') as FormArray;
        const puntajes = opciones.controls.map(opcion => opcion.get('puntaje')?.value);
        const textosOpcion = opciones.controls.map(opcion => opcion.get('textoOpcion')?.value);

        if (puntajes.includes(null) || textosOpcion.includes('') || !this.isOpcionesPuntajesUnicos(opciones)) {
            return false;
        }
    }

    return true;
}

  customTrackBy(index: number, obj: any): any {
    return index;
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

  onImageUpload(event: any, preguntaIndex: number) {
    const file = event.target.files[0];
    const pregunta = this.preguntas.at(preguntaIndex);
    pregunta.get('imagenPregunta')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[preguntaIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onPortadaUpload(event: any) {
    const file = event.target.files[0];
    this.testPersonalidadForm.get('portada')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.portadaPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  isOpcionesPuntajesUnicos(opciones: FormArray): boolean {
    const puntajes = opciones.controls.map(opcion => opcion.get('puntaje')?.value);
    return new Set(puntajes).size === puntajes.length;
}
}