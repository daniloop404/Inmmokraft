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
  imagePreviews: string[] = [];
  portadaPreview: string | null = null; // Previsualización de la portada

  constructor(
    private formBuilder: FormBuilder,
    private testPersonalidadService: TestPersonalidadService,
    private route: ActivatedRoute
  ) {
    this.testPersonalidadForm = this.formBuilder.group({
      nombreTest: ['', Validators.required],
      categoria: ['', Validators.required],
      portada: [null], // Control para la portada
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
      categoria: testPersonalidad.categoria,
      portada: testPersonalidad.portada // Asignar la URL de la portada
    });
    this.portadaPreview = testPersonalidad.portada; // Mostrar la portada en la previsualización

    const preguntas = testPersonalidad.preguntas.map((pregunta) => this.createPreguntaGroup(pregunta));
    this.testPersonalidadForm.setControl('preguntas', this.formBuilder.array(preguntas));

    const rangosPuntaje = testPersonalidad.rangosPuntaje.map((rango) => this.createRangoGroup(rango));
    this.testPersonalidadForm.setControl('rangosPuntaje', this.formBuilder.array(rangosPuntaje));
  }

  createPreguntaGroup(pregunta: any) {
    return this.formBuilder.group({
      textoPregunta: [pregunta.textoPregunta, Validators.required],
      imagenPregunta: [pregunta.imagenPregunta],
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
        imagenPregunta: [null],
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

  async onSubmit() {
    if (!this.isFormValid()) {
        console.error('Por favor complete todos los campos obligatorios.');
        return;
    }
    
    const confirmacion = confirm('¿Está seguro de que desea modificar el Test de Personalidad?');
    if (confirmacion) {
        const testModificado = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };

        // Subir la imagen de portada si es un archivo
        if (testModificado.portada instanceof File) {
          const portadaFile = testModificado.portada;
          try {
            const portadaUrl = await this.testPersonalidadService.uploadImage(portadaFile);
            testModificado.portada = portadaUrl;
          } catch (error) {
            console.error('Error al cargar la imagen de portada:', error);
            return;
          }
        }

        // Subir la imagen de cada pregunta y guardar su URL en el objeto
        const uploads = [];
        for (let i = 0; i < testModificado.preguntas.length; i++) {
          const pregunta = testModificado.preguntas[i];
          if (pregunta.imagenPregunta instanceof File) { // Verificar si es un archivo y no una URL
            const file = pregunta.imagenPregunta;
            const uploadTask = this.testPersonalidadService.uploadImage(file).then(url => {
              pregunta.imagenPregunta = url; // Guardar la URL en el objeto
            });
            uploads.push(uploadTask);
          }
        }

        try {
            // Esperar a que todas las cargas de imágenes se completen antes de modificar el test
            await Promise.all(uploads);

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
        } catch (error) {
            console.error('Error al cargar imágenes:', error);
        }
    } else {
        console.log('El Test de Personalidad no fue modificado.');
    }
  }

  onImageUpload(event: any, preguntaIndex: number) {
    const file = event.target.files[0];
    const preguntas = this.testPersonalidadForm.get('preguntas') as FormArray; // Obtener el array de preguntas
    const pregunta = preguntas.at(preguntaIndex) as FormGroup; // Obtener la pregunta específica
    pregunta.get('imagenPregunta')?.setValue(file); // Asignar el archivo al control imagenPregunta de la pregunta específica

    // Mostrar previsualización de la imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[preguntaIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onPortadaUpload(event: any) {
    const file = event.target.files[0];
    this.testPersonalidadForm.get('portada')?.setValue(file);

    // Mostrar previsualización de la portada
    const reader = new FileReader();
    reader.onload = () => {
      this.portadaPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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