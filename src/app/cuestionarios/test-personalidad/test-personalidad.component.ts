import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';

interface Pregunta {
  id: string;
  textoPregunta: string;
  opciones: string[]; // Agregamos opciones para cada pregunta
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
  questionsPerPage: number = 1; // Solo una pregunta por página para este tipo de test
  testPersonalidad: any | null = null;
  totalQuestions: number = 0;
  selectedAnswers: RespuestaSeleccionada[] = []; // Array para almacenar las respuestas seleccionadas

  constructor(
    private route: ActivatedRoute,
    private testPersonalidadService: TestPersonalidadService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const testPersonalidadId = params['id'];
      // Obtener el test de personalidad por su ID
      this.testPersonalidadService.getTestPersonalidadById(testPersonalidadId).subscribe(testPersonalidad => {
        if (testPersonalidad) {
          this.testPersonalidad = testPersonalidad;
          this.totalQuestions = this.testPersonalidad.preguntas.length;
          // Asignar las opciones a cada pregunta
          this.testPersonalidad.preguntas.forEach(pregunta => {
            pregunta.opciones = ['En desacuerdo totalmente', 'En desacuerdo', 'Ni en desacuerdo ni en acuerdo', 'En acuerdo', 'En total acuerdo'];
          });
          // Inicializar las respuestas seleccionadas
          this.initializeSelectedAnswers();
        }
      });
    });
  }

  selectAnswer(preguntaIndex: number, opcionIndex: number) {
    this.selectedAnswers[preguntaIndex].opcionIndex = opcionIndex;
  }
  
  initializeSelectedAnswers() {
    this.selectedAnswers = this.testPersonalidad.preguntas.map(pregunta => ({ preguntaId: pregunta.id, opcionIndex: null }));
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
    }
  }

  nextPage() {
    if (this.currentPage < this.totalQuestions) {
      this.currentPage++;
    }
  }
}