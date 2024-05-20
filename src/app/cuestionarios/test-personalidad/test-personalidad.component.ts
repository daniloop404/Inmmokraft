import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';

interface Pregunta {
  id: string;
  textoPregunta: string;
  opciones: string[];
  imagenPregunta: string;
}

interface RespuestaSeleccionada {
  preguntaId: string;
  opcionIndex: number | null;
}

@Component({
  selector: 'app-test-personalidad',
  templateUrl: './test-personalidad.component.html',
  styleUrls: ['./test-personalidad.component.css']
})
export class TestPersonalidadComponent implements OnInit {
  currentPage: number = 1;
  questionsPerPage: number = 10; // Número de preguntas por página
  paginatedPreguntas: Pregunta[] = []; // Preguntas paginadas
  testPersonalidad: any | null = null;
  totalQuestions: number = 0;
  selectedAnswers: RespuestaSeleccionada[] = [];
  hoveredOption: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private testPersonalidadService: TestPersonalidadService
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
    this.selectedAnswers.forEach(respuesta => {
      if (respuesta.opcionIndex !== null) {
        totalScore += respuesta.opcionIndex + 1;
      }
    });
    return totalScore;
  }

  submit() {
    const totalScore = this.calculateScore();
    const resultado = this.getRangeResult(totalScore);
    alert(`Tu puntaje es ${totalScore}. ${resultado}`);
  }

  getRangeResult(score: number): string {
    const rangos = this.testPersonalidad.rangosPuntaje;
    for (let i = 0; i < rangos.length; i++) {
      if (score >= rangos[i].rangoMenor && score <= rangos[i].rangoMayor) {
        return rangos[i].resultado;
      }
    }
    return "No se pudo determinar el resultado.";
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
}