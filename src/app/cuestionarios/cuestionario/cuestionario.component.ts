import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuestionariosService } from '../cuestionarios.service';

interface Option {
  text: string;
  correct: string | boolean;
  words?: string[];
  selected: boolean;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  selectedAnswer: string | null;
  imageUrl?: string;
}

interface Cuestionario {
  nombrecuestionario: string;
  category: string;
  questions: Question[];
  portadaUrl?: string; // Asegúrate de tener esta propiedad
}

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {
  currentPage: number = 1;
  questionsPerPage: number = 10;
  paginatedQuestions: Question[] = [];
  totalQuestions: number = 0;
  selectedAnswers: Map<number, string | null>[] = [];
  cuestionario: Cuestionario | null = null;
  hoveredOption: Option | null = null;

  constructor(
    private route: ActivatedRoute,
    private cuestionariosService: CuestionariosService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const cuestionarioId = params['id'];
      // Obtener el cuestionario correspondiente por su ID
      this.cuestionariosService.getCuestionarioById(cuestionarioId).subscribe(cuestionario => {
        if (cuestionario) {
          this.cuestionario = cuestionario;
          this.totalQuestions = this.cuestionario.questions.length;
          this.initializeSelectedAnswers();
          this.paginateQuestions();
        }
      });
    });
  }

  initializeSelectedAnswers() {
    for (let i = 0; i < this.totalQuestions; i++) {
      this.selectedAnswers[i] = new Map<number, string | null>();
    }
  }

  paginateQuestions() {
    const startIndex = (this.currentPage - 1) * this.questionsPerPage;
    const endIndex = startIndex + this.questionsPerPage;
    this.paginatedQuestions = this.cuestionario?.questions.slice(startIndex, endIndex) || [];
  }

  selectAnswer(question: Question, option: Option) {
    this.clearSelectedOptions(question);
    option.selected = true;
    this.selectedAnswers[question.id - 1].set(question.id, option.text);
    question.selectedAnswer = option.text;
  }

  clearSelectedOptions(question: Question) {
    question.options.forEach(option => option.selected = false);
  }

  handleQuestion(question: Question): number {
    const correctOption = question.options.find(option => option.correct === true);
    const selectedAnswer = this.selectedAnswers[question.id - 1].get(question.id);
    return selectedAnswer === correctOption?.text ? 1 : 0;
  }

  submit() {
    let totalScore = 0;
    this.cuestionario?.questions.forEach(question => {
      totalScore += this.handleQuestion(question);
    });
    alert(`Respondiste ${totalScore} de ${this.totalQuestions} preguntas correctamente.`);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateQuestions();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalQuestions / this.questionsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginateQuestions();
    }
  }

  isOptionHovered(option: Option): boolean {
    return this.hoveredOption === option;
  }

  setHoveredOption(option: Option) {
    this.hoveredOption = option;
  }

  clearHoveredOption() {
    this.hoveredOption = null;
  }
}