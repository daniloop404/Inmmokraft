import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionariosService } from 'src/app/cuestionarios/cuestionarios.service';

@Component({
  selector: 'app-modificar-cuestionario',
  templateUrl: './modificar-cuestionario.component.html',
  styleUrls: ['./modificar-cuestionario.component.css']
})
export class ModificarCuestionarioComponent implements OnInit {
  cuestionarioForm: FormGroup;
  cuestionarioId: string;
  imagePreviews: string[] = [];
  portadaPreview: string | null = null; // Previsualización de la portada

  constructor(
    private formBuilder: FormBuilder,
    private cuestionariosService: CuestionariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cuestionarioForm = this.formBuilder.group({
      nombrecuestionario: ['', Validators.required],
      category: ['', Validators.required],
      portadaFile: [null], // Campo para la imagen de portada
      questions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.cuestionarioId = this.route.snapshot.paramMap.get('id');
    this.cuestionariosService.getCuestionarioById(this.cuestionarioId).subscribe(
      (cuestionario) => {
        this.initForm(cuestionario);
      },
      (error) => {
        console.error('Error al cargar el cuestionario:', error);
      }
    );
  }

  initForm(cuestionario: any) {
    this.cuestionarioForm.patchValue({
      nombrecuestionario: cuestionario.nombrecuestionario,
      category: cuestionario.category
    });

    this.imagePreviews = [];
    this.portadaPreview = cuestionario.portadaUrl; // Asignar la imagen de portada si existe

    cuestionario.questions.forEach((question, index) => {
      const options = this.formBuilder.array(
        question.options.map((option) =>
          this.formBuilder.group({
            text: [option.text, Validators.required],
            correct: [option.correct]
          })
        )
      );

      const questionGroup = this.formBuilder.group({
        id: [question.id],
        text: [question.text, Validators.required],
        options: options,
        selectedAnswer: [question.selectedAnswer],
        imageUrl: [question.imageUrl],
        imageFile: [null]
      });

      this.questions.push(questionGroup);
      this.imagePreviews.push(question.imageUrl); // Agregar la imagen existente
    });
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
      imageUrl: [''],
      imageFile: [null]
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
    const imageUrl = this.questions.at(index).get('imageUrl').value;
    if (imageUrl) {
      this.cuestionariosService.deleteImageFromStorage(imageUrl).then(() => {
        console.log('Imagen eliminada de la base de datos.');
      }).catch(error => {
        console.error('Error al eliminar la imagen:', error);
      });
    }
    this.questions.removeAt(index);
    this.imagePreviews.splice(index, 1);
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

  async onSubmit() {
    if (!this.isFormValid()) {
      console.error('Por favor complete todos los campos obligatorios.');
      return;
    }

    const updatedCuestionario = { ...this.cuestionarioForm.value };

    const preguntasValidas = updatedCuestionario.questions.every((question: any) => {
      return question.options.some((option: any) => option.correct);
    });

    if (!preguntasValidas) {
      alert('Cada pregunta debe tener al menos una opción marcada como correcta.');
      return;
    }

    if (updatedCuestionario.portadaFile) {
      try {
        const portadaUrl = await this.cuestionariosService.uploadImage(updatedCuestionario.portadaFile);
        updatedCuestionario.portadaUrl = portadaUrl;
        updatedCuestionario.portadaFile = null;
      } catch (error) {
        console.error('Error al cargar la portada:', error);
      }
    }

    for (let i = 0; i < updatedCuestionario.questions.length; i++) {
      const question = updatedCuestionario.questions[i];
      if (question.imageFile) {
        try {
          const imageUrl = await this.cuestionariosService.uploadImage(question.imageFile);
          question.imageUrl = imageUrl;
          question.imageFile = null;
        } catch (error) {
          console.error('Error al cargar la imagen:', error);
        }
      } else {
        question.imageUrl = this.imagePreviews[i];
      }
    }

    this.cuestionariosService.updateCuestionario(this.cuestionarioId, updatedCuestionario).subscribe(
      (response) => {
        console.log('Cuestionario actualizado exitosamente:', response);
        this.router.navigate(['/cuestionarios']);
      },
      (error) => {
        console.error('Error al actualizar el cuestionario:', error);
      }
    );
  }

  onPortadaUpload(event: any) {
    const file = event.target.files[0];
    this.cuestionarioForm.get('portadaFile')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.portadaPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageUpload(event: any, questionIndex: number) {
    const file = event.target.files[0];
    const question = this.questions.at(questionIndex);
    question.get('imageFile')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[questionIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  isFormValid(): boolean {
    if (this.cuestionarioForm.invalid) {
      return false;
    }

    const controls = this.cuestionarioForm.controls;
    for (const field in controls) {
      if (controls[field].invalid) {
        return false;
      }
    }

    const questions = this.questions.controls;
    for (const question of questions) {
      if (question.invalid) {
        return false;
      }
    }

    return true;
  }
}