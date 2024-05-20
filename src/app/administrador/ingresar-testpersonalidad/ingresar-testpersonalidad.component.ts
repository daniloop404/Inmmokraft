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
  imagePreviews: string[] = [];
  portadaPreview: string | null = null; // Previsualización de la imagen de portada

  constructor(private formBuilder: FormBuilder, private testPersonalidadService: TestPersonalidadService) {
    this.testPersonalidadForm = this.formBuilder.group({
      nombreTest: ['', Validators.required],
      categoria: ['', Validators.required],
      portada: [null], // Campo para la imagen de portada
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
      ]),
      imagenPregunta: [''] // Agregar campo para la imagen de la pregunta
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

  async onSubmit() {
    if (!this.isFormValid()) {
      console.error('Por favor complete todos los campos obligatorios.');
      return;
    }
    
    const confirmacion = confirm('¿Está seguro de que desea guardar el Test de Personalidad?');
    if (confirmacion) {
      const nuevoTest = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };
  
      // Subir la imagen de cada pregunta y guardar su URL en el objeto
      const uploads = [];
      for (let i = 0; i < nuevoTest.preguntas.length; i++) {
        const pregunta = nuevoTest.preguntas[i];
        if (pregunta.imagenPregunta) {
          const file = pregunta.imagenPregunta;
          const uploadTask = this.testPersonalidadService.uploadImage(file).then(url => {
            pregunta.imagenPregunta = url; // Guardar la URL en el objeto
          });
          uploads.push(uploadTask);
        }
      }

      // Subir la imagen de portada y guardar su URL en el objeto
      if (nuevoTest.portada) {
        const portadaFile = nuevoTest.portada;
        const uploadPortadaTask = this.testPersonalidadService.uploadImage(portadaFile).then(url => {
          nuevoTest.portada = url; // Guardar la URL en el objeto
        });
        uploads.push(uploadPortadaTask);
      }
  
      try {
        // Esperar a que todas las cargas de imágenes se completen antes de guardar el test
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

  // Función para manejar la carga de imágenes de preguntas
  onImageUpload(event: any, preguntaIndex: number) {
    const file = event.target.files[0];
    const pregunta = this.preguntas.at(preguntaIndex);
    pregunta.get('imagenPregunta')?.setValue(file);

    // Mostrar previsualización de la imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[preguntaIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Función para manejar la carga de la imagen de portada
  onPortadaUpload(event: any) {
    const file = event.target.files[0];
    this.testPersonalidadForm.get('portada')?.setValue(file);

    // Mostrar previsualización de la imagen de portada
    const reader = new FileReader();
    reader.onload = () => {
      this.portadaPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}