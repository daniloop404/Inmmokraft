import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
 
export class HomeComponent {
  currentSlide = 0;
  slides = [
    { image: '/assets/images/carouselimg4.png', alt: 'Beneficios de hacer tests', title: 'Beneficios de hacer tests', description: 'Realizar tests te ayuda a comprobar tu conocimiento, identificar áreas de mejora y descubrir tus fortalezas y debilidades.' },
    { image: '/assets/images/carouselimg2.png', alt: 'Opción múltiple', title: 'Opción Múltiple', description: 'En estos tests, se presentan varias opciones de respuesta y debes seleccionar la correcta entre ellas.' },
    { image: '/assets/images/carouselimg3.png', alt: 'Escala de Likert', title: 'Escala de Likert', description: 'Este tipo de test te presenta afirmaciones y debes indicar tu grado de acuerdo o desacuerdo con ellas en una escala.' },
    { image: '/assets/images/carouselimg1.png', alt: 'Verdadero o falso', title: 'Verdadero o falso', description: 'Este tipo de test presenta afirmaciones y debes indicar si son verdaderas o falsas.' }
  ];
  intervalId: any;

  ngAfterViewInit() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 10000); // 5000 milliseconds = 5 seconds
  }
  pauseSlideShow() {
    clearInterval(this.intervalId);
  }

  resumeSlideShow() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  selectSlide(index: number) {
    this.currentSlide = index;
  }
}