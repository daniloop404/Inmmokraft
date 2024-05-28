import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms'; 
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modificar-test',
  templateUrl: './modificar-test.component.html',
  styleUrls: ['./modificar-test.component.css']
})
export class ModificarTestComponent {
  testPersonalidadForm: FormGroup;
  testGuardado: boolean = false;
  puntajeTotal: number;
  testId: string;
  imagePreviews: string[] = [];
  portadaPreview: string | null = null;// Array para la previsualización
  imageFiles: File[] = []; // Previsualización de la portada
  preguntas_temp: { [index: number]: any } = {};
  mostrarMensajeErrorGeneral: boolean = false; // Variable para mostrar el mensaje general de error
  subiendoTest: boolean = false; // Variable para indicar si el test está subiendo
  testSubido: boolean = false; // Variable para indicar si el test se subió correctamente
  rangoImagePreviews: string[] = []; // Arreglo para previsualizar las imágenes de los rangos
  rangoImageFiles: File[] = []; // Arreglo para almacenar las imágenes de los rangos

  constructor(
    private formBuilder: FormBuilder,
    private testPersonalidadService: TestPersonalidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.testPersonalidadForm = this.formBuilder.group({
      nombreTest: ['', Validators.required],
      categoria: ['', Validators.required],
      portada: [null],
      preguntas: this.formBuilder.array([]),
      rangosPuntaje: this.formBuilder.array([
        this.createRango(1, 1), // Inicializa los rangos vacíos
        this.createRango(2, 2),
        this.createRango(3, 3)
      ])
    });
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id')!;
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
    const preguntasFormArray = this.testPersonalidadForm.get('preguntas') as FormArray; // Obtener el FormArray existente
    preguntasFormArray.clear(); // Limpia el FormArray antes de agregar las preguntas

    testPersonalidad.preguntas.forEach((pregunta: any, index: number) => {
      // Utiliza una función específica para inicializar las preguntas
      preguntasFormArray.push(this.createPreguntaFromData(pregunta));
  
      // Agrega la previsualización de la imagen
      if (pregunta.imagenPregunta) {
        this.imagePreviews[index] = pregunta.imagenPregunta; // Asigna la URL de la imagen
        this.imageFiles[index] = null; // Inicializa el espacio para la imagen de la pregunta
      }
    });

    const rangosPuntajeFormArray = this.testPersonalidadForm.get('rangosPuntaje') as FormArray;
    rangosPuntajeFormArray.clear();

    testPersonalidad.rangosPuntaje.forEach((rango: any, index: number) => {
      rangosPuntajeFormArray.push(this.createRango(rango.rangoMenor, rango.rangoMayor, rango.resultado, rango.descripcion, rango.imagenRango));
      if (rango.imagenRango) {
        this.rangoImagePreviews[index] = rango.imagenRango; // Asigna la URL de la imagen
        this.rangoImageFiles[index] = null; // Inicializa el espacio para la imagen del rango
      }
    });

    this.updatePuntajeTotal();
  }

  // Función específica para inicializar las preguntas a partir de los datos de la base de datos
  createPreguntaFromData(pregunta: any) {
    // Inicializa un grupo de pregunta con opciones vacías
    const preguntaGroup = this.formBuilder.group({
      tipoPregunta: [pregunta.tipoPregunta, Validators.required],
      textoPregunta: [pregunta.textoPregunta, Validators.required],
      imagenPregunta: [pregunta.imagenPregunta],
      opciones: this.formBuilder.array([]) // Inicializa opciones vacías
    });
    this.savePreguntaState(pregunta.id, preguntaGroup);

    // Almacena las opciones en `preguntas_temp` para esta pregunta
    if (!this.preguntas_temp[pregunta.id]) { // Si no existe el índice en el array, lo crea
      this.preguntas_temp[pregunta.id] = {}; 
    }
    this.preguntas_temp[pregunta.id][pregunta.tipoPregunta] = { 
      tipoPregunta: pregunta.tipoPregunta,
      textoPregunta: pregunta.textoPregunta,
      imagenPregunta: pregunta.imagenPregunta,
      opciones: pregunta.opciones // Guarda las opciones en `preguntas_temp`
    };

    // Agrega las opciones según el tipo de pregunta
    if (pregunta.tipoPregunta === 'multiple') {
      const opcionesFormArray = preguntaGroup.get('opciones') as FormArray;
      pregunta.opciones.forEach((opcion: any) => {
        opcionesFormArray.push(this.createOpcion(opcion));
      });
    } else if (pregunta.tipoPregunta === 'siNo') {
      const opcionesFormArray = preguntaGroup.get('opciones') as FormArray;
      opcionesFormArray.push(this.createOpcionAutomatica('Sí', 5));
      opcionesFormArray.push(this.createOpcionAutomatica('No', 1));
    }

    return preguntaGroup;
  }
  createPreguntaGroup(pregunta: any) {
    let opciones = this.formBuilder.array([]);

    // Crea las opciones cuando se añade la pregunta, no sólo cuando cambia el tipo
    if (pregunta.tipoPregunta === 'multiple') {
      opciones = this.formBuilder.array(pregunta.opciones.map((opcion: any) => this.createOpcion(opcion)));
    } else if (pregunta.tipoPregunta === 'siNo') {
      opciones.push(this.createOpcionAutomatica('Sí', 5));
      opciones.push(this.createOpcionAutomatica('No', 1));
    }

    return this.formBuilder.group({
      tipoPregunta: [pregunta.tipoPregunta, Validators.required],
      textoPregunta: [pregunta.textoPregunta, Validators.required],
      imagenPregunta: [pregunta.imagenPregunta],
      opciones: opciones
    });
  }

  createOpcion(opcion: any = { textoOpcion: '', puntaje: null }) {
    return this.formBuilder.group({
      textoOpcion: [opcion.textoOpcion, Validators.required],
      puntaje: [opcion.puntaje, Validators.required]
    });
  }

  createRango(menor: number, mayor: number, resultado?: string, descripcion?: string, imagenRango?: string) {
    return this.formBuilder.group({
      rangoMenor: [menor, Validators.required],
      rangoMayor: [mayor, Validators.required],
      resultado: [resultado || '', Validators.required],
      descripcion: [descripcion || '', Validators.required],
      imagenRango: [imagenRango || ''] // Nuevo campo para la imagen del rango
    });
  }

  createOpcionAutomatica(texto: string, puntaje: number) {
    return this.formBuilder.control({
      textoOpcion: texto,
      puntaje: puntaje
    });
  }

  get preguntas() {
    return this.testPersonalidadForm.get('preguntas') as FormArray;
  }

  get rangosPuntaje() {
    return this.testPersonalidadForm.get('rangosPuntaje') as FormArray;
  }

  addPregunta() {
    const pregunta = this.formBuilder.group({
      tipoPregunta: ['multiple', Validators.required], // Asigna el tipo a 'multiple' por defecto
      textoPregunta: ['', Validators.required],
      opciones: this.formBuilder.array([
        this.createOpcion(), // Crea 3 opciones por defecto al añadir la pregunta
        this.createOpcion(),
        this.createOpcion()
      ]),
      imagenPregunta: ['']
    });
    this.preguntas.push(pregunta);
    this.updatePuntajeTotal();
    this.imageFiles.push(null); // Agrega un espacio para la nueva imagen
    this.imagePreviews.push(null); // Agrega un espacio para la nueva previsualización
  }

  updatePuntajeTotal() {
    let total = 0;
    this.preguntas.controls.forEach(pregunta => {
      const tipo = pregunta.get('tipoPregunta')?.value;
      if (tipo === 'multiple') {
        total += 5;
      } else if (tipo === 'siNo') {
        total += 5;
      } else if (tipo === 'rango') {
        total += 10;
      }
    });
    this.puntajeTotal = total;
    this.updateRangosPuntaje();
  }

  updateRangosPuntaje() {
    // Obtiene los valores actuales de los campos "resultado" y "descripcion" de cada rango
    const currentRangos = this.rangosPuntaje.value.map((rango, index) => ({
      resultado: rango.resultado,
      descripcion: rango.descripcion
    }));
    // Actualiza los valores mínimos y máximos de los rangos
    const numPreguntas = this.preguntas.length;
    const puntajeMin = numPreguntas;
    const puntajeMax = this.puntajeTotal;

    const rango1 = { menor: puntajeMin, mayor: Math.floor((puntajeMax - puntajeMin) / 3) + puntajeMin };
    const rango2 = { menor: rango1.mayor + 1, mayor: Math.floor(2 * (puntajeMax - puntajeMin) / 3) + puntajeMin };
    const rango3 = { menor: rango2.mayor + 1, mayor: puntajeMax };

    // Actualiza los rangos existentes
    this.rangosPuntaje.at(0).patchValue({ rangoMenor: rango1.menor, rangoMayor: rango1.mayor });
    this.rangosPuntaje.at(1).patchValue({ rangoMenor: rango2.menor, rangoMayor: rango2.mayor });
    this.rangosPuntaje.at(2).patchValue({ rangoMenor: rango3.menor, rangoMayor: rango3.mayor });

    // Reasigna los valores de "resultado" y "descripcion"
    this.rangosPuntaje.at(0).patchValue({ resultado: currentRangos[0]?.resultado || '', descripcion: currentRangos[0]?.descripcion || '' });
    this.rangosPuntaje.at(1).patchValue({ resultado: currentRangos[1]?.resultado || '', descripcion: currentRangos[1]?.descripcion || '' });
    this.rangosPuntaje.at(2).patchValue({ resultado: currentRangos[2]?.resultado || '', descripcion: currentRangos[2]?.descripcion || '' });
  }

  deletePregunta(index: number) {
    this.preguntas.removeAt(index);
    this.updatePuntajeTotal();
    this.imageFiles.splice(index, 1); // Elimina el elemento del arreglo de imágenes
    this.imagePreviews.splice(index, 1); // Elimina el elemento del arreglo de previsualizaciones
  }

  // Valida el formulario completo solo cuando se presione el botón "Guardar Test"
  async onSubmit() {
    // Validar cada pregunta individualmente
    for (let i = 0; i < this.preguntas.controls.length; i++) {
      const pregunta = this.preguntas.controls[i];
      if (!this.isPreguntaValid(pregunta)) {
        this.mostrarMensajeErrorGeneral = true;
        return;
      }
    }
    // Validar los rangos de puntaje aquí
    if (!this.isRangosValid()) {
      this.mostrarMensajeErrorGeneral = true;
      return;
    }

    // Validar los campos del formulario principal
    if (this.testPersonalidadForm.get('nombreTest')?.invalid ||
      this.testPersonalidadForm.get('categoria')?.invalid) {
      this.mostrarMensajeErrorGeneral = true;
      return;
    }

    const confirmacion = confirm('¿Está seguro de que desea guardar el Test de Personalidad?');
    if (confirmacion) {
      this.subiendoTest = true;
      const testModificado = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };
  
      // Cargar las imágenes al Storage
      const uploads = [];
  
      // Actualizar el arreglo de preguntas en la estructura del test
      testModificado.preguntas = testModificado.preguntas.map((pregunta, index) => {
        if (this.imageFiles[index]) {
          pregunta.imagenPregunta = this.imageFiles[index];
        }
  
        // Actualización del objeto de la pregunta con la estructura correcta según el tipo de pregunta
        if (pregunta.tipoPregunta === 'multiple') {
          pregunta.opciones = pregunta.opciones.map(opcion => ({
            puntaje: opcion.puntaje,
            textoOpcion: opcion.textoOpcion
          }));
        } else if (pregunta.tipoPregunta === 'siNo') {
          pregunta.opciones = [
            {
              puntaje: 5,
              textoOpcion: 'Sí'
            },
            {
              puntaje: 1,
              textoOpcion: 'No'
            }
          ];
        } else if (pregunta.tipoPregunta === 'rango') {
          // No hay opciones para las preguntas de tipo rango
          delete pregunta.opciones;
        }
  
        return pregunta;
      });

      // Carga las imágenes
      for (let i = 0; i < testModificado.preguntas.length; i++) {
        const pregunta = testModificado.preguntas[i];
        if (pregunta.imagenPregunta instanceof File) {
          const file = pregunta.imagenPregunta;
          const uploadTask = this.testPersonalidadService.uploadImage(file).then(url => {
            pregunta.imagenPregunta = url; // Actualizar con la URL real
          });
          uploads.push(uploadTask);
        }
      }

      // Verificar si se ha seleccionado una nueva portada
      if (testModificado.portada instanceof File) {
        const portadaFile = testModificado.portada;
        const uploadPortadaTask = this.testPersonalidadService.uploadImage(portadaFile).then(url => {
          testModificado.portada = url;
        });
        uploads.push(uploadPortadaTask);
      }

      // Carga las imágenes de los rangos
      testModificado.rangosPuntaje = testModificado.rangosPuntaje.map((rango, index) => {
        if (this.rangoImageFiles[index]) {
          rango.imagenRango = this.rangoImageFiles[index];
        }
        return rango;
      });
      for (let i = 0; i < testModificado.rangosPuntaje.length; i++) {
        const rango = testModificado.rangosPuntaje[i];
        if (rango.imagenRango instanceof File) {
          const file = rango.imagenRango;
          const uploadTask = this.testPersonalidadService.uploadImage(file).then(url => {
            rango.imagenRango = url; // Actualizar con la URL real
          });
          uploads.push(uploadTask);
        }
      }

      try {
        await Promise.all(uploads);

        this.testPersonalidadService.updateTestPersonalidad(this.testId, testModificado).subscribe(
          (response) => {
            console.log('Test de Personalidad modificado exitosamente:', response);
            this.subiendoTest = false; // El test ya no se está subiendo
            this.testSubido = true; // Indicar que el test se subió correctamente
            setTimeout(() => {
              this.testGuardado = true;
              setTimeout(() => {
                this.testGuardado = false;
                this.router.navigate(['/administrador']); 
              }, 3000);
            }, 3000);
          },
          (error) => {
            console.error('Error al modificar el Test de Personalidad:', error);
            this.subiendoTest = false; // Reiniciar la variable en caso de error
          }
        );
      } catch (error) {
        console.error('Error al cargar imágenes:', error);
        this.subiendoTest = false; // Reiniciar la variable en caso de error
      }
    } else {
      console.log('El Test de Personalidad no fue guardado.');
    }

  }

  // Función para validar las preguntas
  isFormValid(): boolean {
    // Esta función ya no es necesaria porque se valida cada pregunta individualmente en onSubmit
    return true;
  }

  // Función para validar los rangos de puntaje
  isRangosValid(): boolean {
    const rangos = this.rangosPuntaje.controls;
    for (let i = 0; i < rangos.length; i++) {
      const rango = rangos[i];
      if (rango.get('resultado')?.value === '' ||
        rango.get('descripcion')?.value === '') {
        return false;
      }
    }
    return true;

  }

  // Función para validar las preguntas
  isPreguntaValid(pregunta: AbstractControl): boolean {
    // Verifica si el AbstractControl es un FormGroup
    if (!(pregunta instanceof FormGroup)) {
      return false;
    }
    const tipoPregunta = pregunta.get('tipoPregunta')?.value;

    // Validación específica para cada tipo de pregunta
    if (tipoPregunta === 'multiple') {
      const opciones = pregunta.get('opciones') as FormArray;
      const puntajes = opciones.controls.map(opcion => opcion.get('puntaje')?.value);
      const textosOpcion = opciones.controls.map(opcion => opcion.get('textoOpcion')?.value);

      // Verificar que todos los campos obligatorios estén llenos y que los puntajes sean únicos
      return !puntajes.includes(null) && !textosOpcion.includes('') && this.isOpcionesPuntajesUnicos(opciones);
    } else if (tipoPregunta === 'siNo' || tipoPregunta === 'rango') {
      // Validación para "Sí/No" y "Rango": solo verifica el texto de la pregunta
      return pregunta.get('textoPregunta')?.value !== '' &&
        pregunta.get('textoPregunta')?.valid;
    } else {
      // Tipo de pregunta no válido
      return false; 
    }

  }

  onTipoPreguntaChange(index: number) {
    this.savePreguntaState(index, this.preguntas.at(index)); // Guardar el estado antes de actualizar las opciones
    this.updateOpciones(index); // Actualizar las opciones según el nuevo tipo de pregunta
    this.updatePuntajeTotal();
  }

  updateOpciones(index: number) {
    const pregunta = this.preguntas.at(index);
    const nuevoTipoPregunta = pregunta.get('tipoPregunta')?.value;
    const opcionesFormArray = pregunta.get('opciones') as FormArray;
  
    // Limpiar el FormArray de opciones antes de agregar las opciones
    opcionesFormArray.clear();
  
    // Restaurar las opciones guardadas
    if (this.preguntas_temp[index] && this.preguntas_temp[index][nuevoTipoPregunta] && this.preguntas_temp[index][nuevoTipoPregunta].opciones) {
      const opcionesGuardadas = this.preguntas_temp[index][nuevoTipoPregunta].opciones;
      opcionesGuardadas.forEach(opcion => {
        opcionesFormArray.push(this.createOpcion(opcion));
      });
    } else {
      // Inicializar las opciones según el nuevo tipo de pregunta
      if (nuevoTipoPregunta === 'siNo') {
        opcionesFormArray.push(this.createOpcionAutomatica('Sí', 5));
        opcionesFormArray.push(this.createOpcionAutomatica('No', 1));
      } else if (nuevoTipoPregunta === 'multiple') {
        while (opcionesFormArray.length < 3) {
          opcionesFormArray.push(this.createOpcion());
        }
      }
    }
  }

  savePreguntaState(index: any, pregunta: any) {
    const tipoPregunta = pregunta.get('tipoPregunta')?.value;
  
    if (!this.preguntas_temp[index]) {
      this.preguntas_temp[index] = {};
    }
    this.preguntas_temp[index][tipoPregunta] = {
      tipoPregunta,
      textoPregunta: pregunta.get('textoPregunta')?.value,
      imagenPregunta: pregunta.get('imagenPregunta')?.value,
      opciones: pregunta.get('opciones')?.value,
    };
  }
  


  customTrackBy(index: number, obj: any): any {
    return index;
  }

  onImageUpload(event: any, preguntaIndex: number) {
    const file = event.target.files[0];
    const pregunta = this.preguntas.at(preguntaIndex);
    pregunta.get('imagenPregunta')?.setValue(file);

    // Actualizar el arreglo de imágenes
    this.imageFiles[preguntaIndex] = file;

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

  onRangoImageUpload(event: any, rangoIndex: number) {
    const file = event.target.files[0];
    const rango = this.rangosPuntaje.at(rangoIndex);
    rango.get('imagenRango')?.setValue(file);

    // Actualizar el arreglo de imágenes de los rangos
    this.rangoImageFiles[rangoIndex] = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.rangoImagePreviews[rangoIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  isOpcionesPuntajesUnicos(opciones: FormArray): boolean {
    const puntajes = opciones.controls.map(opcion => opcion.get('puntaje')?.value);
    const puntajesUnicos = new Set(puntajes);
    return puntajes.length === puntajesUnicos.size;
  }
}