import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-antecedentes-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './antecedentes-step.html',
  styleUrls: ['./antecedentes-step.css']
})
export class AntecedentesStep {
  @Input() group!: FormGroup;
}
