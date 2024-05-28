import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';
import { ResultadosService } from 'src/app/servicios/resultados.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

interface Pregunta {
  id: string;
  textoPregunta: string;
  opciones: { puntaje: number, textoOpcion: string }[]; // Formato actualizado para opciones
  imagenPregunta: string;
  tipoPregunta: 'multiple' | 'siNo' | 'rango'; // Tipo de pregunta
}

interface RespuestaSeleccionada {
  preguntaId: string;
  opcionIndex: number | null;
}

interface RangoPuntaje {
  descripcion: string;
  imagenRango: string;
  rangoMayor: number;
  rangoMenor: number;
  resultado: string;
}

@Component({
  selector: 'app-test-personalidad',
  templateUrl: './test-personalidad.component.html',
  styleUrls: ['./test-personalidad.component.css']
})
export class TestPersonalidadComponent implements OnInit {
  rangeValue: number;
  currentPage: number = 1;
  questionsPerPage: number = 10;
  paginatedPreguntas: Pregunta[] = [];
  testPersonalidad: any | null = null;
  totalQuestions: number = 0;
  selectedAnswers: RespuestaSeleccionada[] = [];
  hoveredOption: string | null = null;
  uid: string | null = null;
  rangeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Arreglo de números para el control deslizante
  showMensajeError: boolean = false; // Variable para controlar la visibilidad del mensaje de error
  showResultados: boolean = false; // Variable para controlar la visibilidad del overlay de resultados
  resultadoTest: RangoPuntaje | null = null; // Objeto que contiene los datos del resultado
  selectedRanges: number[] = []; // Nueva variable para almacenar los valores de los rangos
  constructor(
    private route: ActivatedRoute,
    private testPersonalidadService: TestPersonalidadService,
    private resultadosService: ResultadosService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const testPersonalidadId = params['id'];
      this.testPersonalidadService.getTestPersonalidadById(testPersonalidadId).subscribe(testPersonalidad => {
        if (testPersonalidad) {
          this.testPersonalidad = testPersonalidad;
          this.totalQuestions = this.testPersonalidad.preguntas.length;
          this.initializeSelectedAnswers();
          this.paginatePreguntas();
        }
      });
    });
    
    this.usuariosService.getEstadoAutenticacion().subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  calculateQuestionScore(preguntaIndex: number): number {
    if (preguntaIndex < this.testPersonalidad.preguntas.length) {
      const pregunta = this.testPersonalidad.preguntas[preguntaIndex];
      const selectedAnswer = this.selectedAnswers.find(answer => answer.preguntaId === pregunta.id);
  
      if (pregunta.tipoPregunta === 'multiple' || pregunta.tipoPregunta === 'siNo') {
        if (selectedAnswer && selectedAnswer.opcionIndex !== null) {
          return Number(pregunta.opciones[selectedAnswer.opcionIndex].puntaje);
        }
      } else if (pregunta.tipoPregunta === 'rango') {
        if (this.selectedRanges[preguntaIndex] !== undefined) {
          return Number(this.selectedRanges[preguntaIndex]);
        }
      }
    }
    return 0; // Si no hay respuesta o la pregunta es inválida, devuelve 0
  }

  initializeSelectedAnswers() {
    this.selectedAnswers = this.testPersonalidad.preguntas.map(pregunta => ({ preguntaId: pregunta.id, opcionIndex: null }));
  }

  paginatePreguntas() {
    const startIndex = (this.currentPage - 1) * this.questionsPerPage;
    const endIndex = startIndex + this.questionsPerPage;
    this.paginatedPreguntas = this.testPersonalidad?.preguntas.slice(startIndex, endIndex) || [];
  }

  selectAnswer(preguntaIndex: number, opcionIndex: number) {
    this.selectedAnswers[preguntaIndex].opcionIndex = opcionIndex;
  }

  isOptionSelected(preguntaIndex: number, opcionIndex: number): boolean {
    return this.selectedAnswers[preguntaIndex].opcionIndex === opcionIndex;
  }

  isOptionHovered(opcion: string): boolean {
    return this.hoveredOption === opcion;
  }

  setHoveredOption(opcion: string) {
    this.hoveredOption = opcion;
  }

  clearHoveredOption() {
    this.hoveredOption = null;
  }

  calculateScore(): number {
    let totalScore = 0;
    for (let i = 0; i < this.testPersonalidad.preguntas.length; i++) {
      const questionScore = this.calculateQuestionScore(i);
      totalScore += questionScore;
    }
    return totalScore;
  }

  submit() {
    if (!this.uid) {
      this.showMensajeError = true;
      return;
    }
  
    // Revisa si todas las preguntas tienen una respuesta válida
    if (this.selectedAnswers.some((respuesta, index) => {
        if (this.paginatedPreguntas[index].tipoPregunta === 'multiple' || this.paginatedPreguntas[index].tipoPregunta === 'siNo') {
          return respuesta.opcionIndex === null; 
        } else if (this.paginatedPreguntas[index].tipoPregunta === 'rango') {
          return !this.selectedRanges[index]; // Verifica si se ha seleccionado un valor en el rango
        }
        return false; // Si no es de tipo 'multiple', 'siNo' o 'rango', no hay problema
      })) {
      this.showMensajeError = true;
      return;
    }

    const totalScore = this.calculateScore();
    this.resultadoTest = this.getRangeResult(totalScore);
    this.showResultados = true;

    // Mostrar el puntaje en el overlay
    console.log(totalScore); // Puedes usar este log para verificar el puntaje
    
    const testPersonalidadId = this.route.snapshot.paramMap.get('id')!;
    this.resultadosService.guardarResultadosTestPersonalidad(this.uid, testPersonalidadId, totalScore, this.resultadoTest.resultado).subscribe(() => {
      console.log('Resultados del test de personalidad guardados exitosamente');
    }, error => {
      console.error('Error al guardar los resultados del test de personalidad:', error);
    });
  }

   getRangeResult(score: number): RangoPuntaje {
    // Calcula el rango de puntuaciones
    const rangos = this.testPersonalidad.rangosPuntaje;

    // Encuentra el rango que coincide con la puntuación
    for (let i = 0; i < rangos.length; i++) {
      if (score >= rangos[i].rangoMenor && score <= rangos[i].rangoMayor) {
        return rangos[i];
      }
    }

    // Si no se encuentra un rango que coincida, devuelve el primer rango
    return rangos[0];
  }

  onRangeChange(preguntaIndex: number, event: Event) {
    const rangeValue = (<HTMLInputElement>event.target).value;
    this.selectedRanges[preguntaIndex] = parseInt(rangeValue, 10); // Guarda el valor del rango
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatePreguntas();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalQuestions / this.questionsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginatePreguntas();
    }
  }

  closeResultados() {
    this.showResultados = false;
  }
}