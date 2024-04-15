import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CuestionariosService } from 'src/app/cuestionarios/cuestionarios.service';

@Component({
  selector: 'app-ingresar-cuestionarios',
  templateUrl: './ingresar-cuestionarios.component.html',
  styleUrls: ['./ingresar-cuestionarios.component.css']
})
export class IngresarCuestionariosComponent {
  cuestionarioForm: FormGroup;
  cuestionarioGuardado: boolean = false;

  constructor(private formBuilder: FormBuilder, private cuestionariosService: CuestionariosService) {
    this.cuestionarioForm = this.formBuilder.group({
      nombrecuestionario: ['', Validators.required],
      category: ['', Validators.required],
      questions: this.formBuilder.array([])
    });

    this.addQuestion();
  }

  get questions() {
    return this.cuestionarioForm.get('questions') as FormArray;
  }

  addQuestion() {
    const question = this.formBuilder.group({
      id: [this.questions.length + 1],
      text: ['', Validators.required],
      options: this.formBuilder.array([
        this.createOption(),
        this.createOption()
      ]),
      selectedAnswer: [null],
      imageUrl: ['']
    });

    this.questions.push(question);
  }

  createOption() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      correct: [false]
    });
  }

  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.createOption());
  }

  deleteOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.removeAt(options.length - 1);
  }

  deleteQuestion(index: number) {
    this.questions.removeAt(index);
  }

  onOptionChange(questionIndex: number, optionIndex: number) {
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;

    options.controls.forEach((option, index) => {
      if (index !== optionIndex) {
        option.get('correct')?.setValue(false);
      }
    });
  }

  canDeleteOption(questionIndex: number): boolean {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    return options.length > 2;
  }

  onSubmit() {
    if (this.cuestionarioForm.valid) {
      const confirmacion = confirm('¿Está seguro de que desea guardar el cuestionario?');
      if (confirmacion) {
        this.cuestionariosService.postCuestionario(this.cuestionarioForm.value).subscribe(
          (response) => {
            console.log('Cuestionario added successfully:', response);
            this.cuestionarioGuardado = true;
            setTimeout(() => {
              this.cuestionarioForm.reset();
              this.addQuestion(); 
              this.cuestionarioGuardado = false;
              location.reload();
            }, 3000); // Refresh the page after 3 seconds
          },
          (error) => {
            console.error('Error adding cuestionario:', error);
            // Handle error
          }
        );
      } else {
        console.log('El cuestionario no fue guardado.');
      }
    } else {
      console.error('Form is invalid');
      // Handle invalid form
    }
  }

  // TrackBy function
  customTrackBy(index: number, obj: any): any {
    return index;
  }
}