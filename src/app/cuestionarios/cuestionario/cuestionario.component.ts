import { Component, OnInit } from '@angular/core';

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
  selectedAnswers: Map<number, string | null>[] = []; // Array to store selected answers for each question
  cuestionarios: Cuestionario[] = [
    {
      nombrecuestionario: 'Conocimientos Generales',
      category: 'General',
      questions: [
        {
          id: 1,
          text: '¿Cuál es la capital de Francia?',
          options: [
            { text: 'París', correct: 'true', selected: false },
            { text: 'Madrid', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 2,
          text: '¿Qué planeta es conocido como el Planeta Rojo?',
          options: [
            { text: 'Marte', correct: 'true', selected: false },
            { text: 'Venus', correct: 'false', selected: false },
            { text: 'Júpiter', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 3,
          text: '¿Cuál de las siguientes ciudades es una capital?',
          options: [
            { text: 'París', correct: 'true', selected: false },
            { text: 'Nueva York', correct: 'false', selected: false },
            { text: 'Roma', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 4,
          text: '¿Qué animal se muestra en la imagen?',
          options: [
            { text: 'Perro', correct: 'false', selected: false },
            { text: 'Gato', correct: 'true', selected: false },
            { text: 'Pájaro', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
          imageUrl: 'https://via.placeholder.com/150',
        },
        {
          id: 5,
          text: 'Verdadero o Falso: El sol es un planeta.',
          options: [
            { text: 'Verdadero', correct: 'false', selected: false },
            { text: 'Falso', correct: 'true', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 6,
          text: '¿Cuál es el río más largo del mundo?',
          options: [
            { text: 'Amazonas', correct: 'true', selected: false },
            { text: 'Nilo', correct: 'false', selected: false },
            { text: 'Misisipi', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 7,
          text: '¿Qué país tiene forma de bota en el mapa mundial?',
          options: [
            { text: 'Italia', correct: 'true', selected: false },
            { text: 'España', correct: 'false', selected: false },
            { text: 'México', correct: 'false', selected: false },
            { text: 'India', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 8,
          text: '¿Cuántos continentes hay en el mundo?',
          options: [
            { text: '5', correct: 'false', selected: false },
            { text: '6', correct: 'true', selected: false },
            { text: '7', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 9,
          text: '¿Qué idioma se habla en Brasil?',
          options: [
            { text: 'Portugués', correct: 'true', selected: false },
            { text: 'Español', correct: 'false', selected: false },
            { text: 'Inglés', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 10,
          text: '¿Quién pintó la Mona Lisa?',
          options: [
            { text: 'Leonardo da Vinci', correct: 'true', selected: false },
            { text: 'Pablo Picasso', correct: 'false', selected: false },
            { text: 'Vincent van Gogh', correct: 'false', selected: false },
            { text: 'Michelangelo', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 11,
          text: '¿Qué elemento químico tiene el símbolo "O"?',
          options: [
            { text: 'Oxígeno', correct: 'true', selected: false },
            { text: 'Oro', correct: 'false', selected: false },
            { text: 'Plata', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 12,
          text: '¿Cuál es el país más grande del mundo por área terrestre?',
          options: [
            { text: 'Rusia', correct: 'true', selected: false },
            { text: 'Canadá', correct: 'false', selected: false },
            { text: 'Estados Unidos', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 13,
          text: '¿Cuál es el océano más grande del mundo?',
          options: [
            { text: 'Pacífico', correct: 'true', selected: false },
            { text: 'Atlántico', correct: 'false', selected: false },
            { text: 'Índico', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 14,
          text: '¿En qué año comenzó la Primera Guerra Mundial?',
          options: [
            { text: '1914', correct: 'true', selected: false },
            { text: '1939', correct: 'false', selected: false },
            { text: '1945', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        },
        {
          id: 15,
          text: '¿Quién escribió "Don Quijote de la Mancha"?',
          options: [
            { text: 'Miguel de Cervantes', correct: 'true', selected: false },
            { text: 'Gabriel García Márquez', correct: 'false', selected: false },
            { text: 'Pablo Neruda', correct: 'false', selected: false },
            { text: 'William Shakespeare', correct: 'false', selected: false }
          ],
          selectedAnswer: null,
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.totalQuestions = this.cuestionarios[0].questions.length;
    this.initializeSelectedAnswers();
    this.paginateQuestions();
  }

  initializeSelectedAnswers() {
    // Initialize selectedAnswers array with null values for each question
    for (let i = 0; i < this.totalQuestions; i++) {
      this.selectedAnswers[i] = new Map<number, string | null>();
    }
  }

  paginateQuestions() {
    const startIndex = (this.currentPage - 1) * this.questionsPerPage;
    const endIndex = startIndex + this.questionsPerPage;
    this.paginatedQuestions = this.cuestionarios[0].questions.slice(startIndex, endIndex);
  }

  selectAnswer(question: Question, option: Option) {
    // Store selected answer in the selectedAnswers array
    this.selectedAnswers[question.id - 1].set(question.id, option.text);
    question.selectedAnswer = option.text;
  }

  handleQuestion(question: Question): number {
    const correctOption = question.options.find(option => option.correct === 'true');
    const selectedAnswer = this.selectedAnswers[question.id - 1].get(question.id);
    return selectedAnswer === correctOption?.text ? 1 : 0;
  }

  submit() {
    let totalScore = 0;
    let totalQuestions = 0;
  
    // Iterate through all questions, not just the ones on the current page
    this.cuestionarios[0].questions.forEach(question => {
      totalScore += this.handleQuestion(question);
      totalQuestions++;
    });
  
    alert(`You answered ${totalScore} out of ${totalQuestions} questions correctly.`);
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
}