import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-conducta-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './conducta-step.html',
  styleUrls: ['./conducta-step.css']
})
export class ConductaStep {
  @Input() group!: FormGroup;

  hours: number[] = Array.from({ length: 24 }, (_, i) => i + 1);
  minutes: number[] = [0, 15, 30, 45];

  getHourFromTime(timeString: string): number {
    if (!timeString) return 1;
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour, 10);
    return hourNum === 0 ? 1 : hourNum;
  }

  getMinuteFromTime(timeString: string): number {
    if (!timeString) return 0;
    const [, minute] = timeString.split(':');
    return parseInt(minute, 10) || 0;
  }

  formatNumber(num: number): string {
    return String(num).padStart(2, '0');
  }

  updateTime(fieldName: string, hour: number, minute: number): void {
    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    this.group.get(fieldName)?.setValue(timeString);
  }

  onHourChange(fieldName: string, hour: number): void {
    const currentValue = this.group.get(fieldName)?.value || '01:00';
    const minute = this.getMinuteFromTime(currentValue);
    this.updateTime(fieldName, hour, minute);
  }

  onMinuteChange(fieldName: string, minute: number): void {
    const currentValue = this.group.get(fieldName)?.value || '01:00';
    const hour = this.getHourFromTime(currentValue);
    this.updateTime(fieldName, hour, minute);
  }
}
