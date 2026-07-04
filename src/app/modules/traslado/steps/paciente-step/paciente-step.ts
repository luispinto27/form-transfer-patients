import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-paciente-step',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule
],
  templateUrl: './paciente-step.html',
  styleUrls: ['./paciente-step.css']
})
export class PacienteStep {
  @Input() group!: FormGroup;
}
