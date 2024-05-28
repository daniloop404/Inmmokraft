import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms'; 
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
  preguntas_temp: { [index: number]: any } = {};
  mostrarMensajeErrorGeneral: boolean = false; // Variable para mostrar el mensaje general de error
  subiendoTest: boolean = false; // Variable para indicar si el test está subiendo
  testSubido: boolean = false; // Variable para indicar si el test se subió correctamente
  rangoImagePreviews: string[] = []; // Array para las previsualizaciones de las imágenes de los rangos

  constructor(private formBuilder: FormBuilder, private testPersonalidadService: TestPersonalidadService) {
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

    this.addPregunta();
  }

  createRango(menor: number, mayor: number) {
    return this.formBuilder.group({
      rangoMenor: [menor, Validators.required],
      rangoMayor: [mayor, Validators.required],
      resultado: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenRango: [''] // Nuevo campo para la imagen del rango
    });
  }

  get preguntas() {
    return this.testPersonalidadForm.get('preguntas') as FormArray;
  }

  get rangosPuntaje() {
    return this.testPersonalidadForm.get('rangosPuntaje') as FormArray;
  }

  addPregunta() {
    const opciones = this.formBuilder.array([
      this.createOpcion(),
      this.createOpcion(),
      this.createOpcion()
    ]);

    const pregunta = this.formBuilder.group({
      tipoPregunta: ['multiple', Validators.required],
      textoPregunta: ['', Validators.required],
      opciones: opciones,
      imagenPregunta: ['']
    });

    this.preguntas.push(pregunta);
    this.updatePuntajeTotal();
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
      descripcion: rango.descripcion,
      imagenRango: rango.imagenRango
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
    this.rangosPuntaje.at(0).patchValue({ resultado: currentRangos[0]?.resultado || '', descripcion: currentRangos[0]?.descripcion || '', imagenRango: currentRangos[0]?.imagenRango || '' });
    this.rangosPuntaje.at(1).patchValue({ resultado: currentRangos[1]?.resultado || '', descripcion: currentRangos[1]?.descripcion || '', imagenRango: currentRangos[1]?.imagenRango || '' });
    this.rangosPuntaje.at(2).patchValue({ resultado: currentRangos[2]?.resultado || '', descripcion: currentRangos[2]?.descripcion || '', imagenRango: currentRangos[2]?.imagenRango || '' });
  }

  addRango(menor: number, mayor: number, resultado?: string, descripcion?: string, imagenRango?: string) {
    const rango = this.formBuilder.group({
      rangoMenor: [menor, Validators.required],
      rangoMayor: [mayor, Validators.required],
      resultado: [resultado || '', Validators.required], // Asigna el valor actual o vacío si no existe
      descripcion: [descripcion || '', Validators.required], // Asigna el valor actual o vacío si no existe
      imagenRango: [imagenRango || ''] // Asigna el valor actual o vacío si no existe
    });
    this.rangosPuntaje.push(rango);
  }

  deletePregunta(index: number) {
    this.preguntas.removeAt(index);
    this.updatePuntajeTotal();
  }

  // Valida el formulario completo solo cuando se presione el botón "Guardar Test"
  async onSubmit() {
    this.mostrarMensajeErrorGeneral = false; // Restablecer el mensaje de error general
    // Validar cada pregunta individualmente
    for (let i = 0; i < this.preguntas.controls.length; i++) {
      const pregunta = this.preguntas.controls[i];
      if (!this.isPreguntaValid(pregunta)) {
        this.mostrarMensajeErrorGeneral = true; // Mostrar el mensaje de error general
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
      this.subiendoTest = true; // Indicar que el test está subiendo
      const nuevoTest = { ...this.testPersonalidadForm.value, tipocuestionario: 'testpersonalidad' };

      const uploads = [];
      for (let i = 0; i < nuevoTest.preguntas.length; i++) {
        const pregunta = nuevoTest.preguntas[i];
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

      for (let i = 0; i < nuevoTest.rangosPuntaje.length; i++) {
        const rango = nuevoTest.rangosPuntaje[i];
        if (rango.imagenRango) {
          const file = rango.imagenRango;
          const uploadTask = this.testPersonalidadService.uploadImage(file).then(url => {
            rango.imagenRango = url;
          });
          uploads.push(uploadTask);
        }
      }

      try {
        await Promise.all(uploads);

        this.testPersonalidadService.postTestPersonalidad(nuevoTest).subscribe(
          (response) => {
            console.log('Test de Personalidad guardado exitosamente:', response);
            this.subiendoTest = false; // El test ya no se está subiendo
            this.testSubido = true; // Indicar que el test se subió correctamente
            setTimeout(() => {
              this.testPersonalidadForm.reset();
              this.addPregunta();
              this.testSubido = false;
              window.location.reload() // Reiniciar la variable después de la actualización
            }, 3000);
          },
          (error) => {
            console.error('Error al guardar el Test de Personalidad:', error);
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
    const pregunta = this.preguntas.at(index);
    const tipoPreguntaActual = pregunta.get('tipoPregunta')?.value;
    const nuevoTipoPregunta = pregunta.get('tipoPregunta')?.value;
    const opcionesFormArray = pregunta.get('opciones') as FormArray;
  
    // Actualizar el estado solo si el tipo de pregunta cambia
    if (tipoPreguntaActual !== nuevoTipoPregunta) {
      this.savePreguntaState(index, pregunta);
    }
  
    // Restaurar las opciones guardadas
    if (this.preguntas_temp[index][nuevoTipoPregunta] && this.preguntas_temp[index][nuevoTipoPregunta].opciones) {
      const opcionesGuardadas = this.preguntas_temp[index][nuevoTipoPregunta].opciones;
      opcionesGuardadas.forEach(opcion => {
        opcionesFormArray.push(this.createOpcion(opcion));
      });
    }
  
    // Inicializar las opciones según el nuevo tipo de pregunta
    if (nuevoTipoPregunta === 'siNo') {
      opcionesFormArray.push(this.createOpcionAutomatica('Sí', 5));
      opcionesFormArray.push(this.createOpcionAutomatica('No', 1));
    } else if (nuevoTipoPregunta === 'multiple') {
      while (opcionesFormArray.length < 3) {
        opcionesFormArray.push(this.createOpcion());
      }
    }
  
    // Limpiar el FormArray de opciones después de agregar las opciones
    opcionesFormArray.clear(); 
  
    this.updatePuntajeTotal();
  }

  savePreguntaState(index: number, pregunta: any) {
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
  
  createOpcion(opcion: { textoOpcion: string, puntaje: number } = { textoOpcion: '', puntaje: null }) {
    return this.formBuilder.group({
      textoOpcion: [opcion.textoOpcion, Validators.required],
      puntaje: [opcion.puntaje, Validators.required]
    });
  }

  createOpcionAutomatica(texto: string, puntaje: number) {
    return this.formBuilder.group({
      textoOpcion: [texto, Validators.required],
      puntaje: [puntaje, Validators.required]
    });
  }

  customTrackBy(index: number, obj: any): any {
    return index;
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

  onRangoImageUpload(event: any, rangoIndex: number) {
    const file = event.target.files[0];
    const rango = this.rangosPuntaje.at(rangoIndex);
    rango.get('imagenRango')?.setValue(file);

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