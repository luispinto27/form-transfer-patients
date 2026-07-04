import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-validation-error-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="content">
      <div class="header">
        <mat-icon class="warn-icon">warning_amber</mat-icon>
        <div class="title-block">
          <h2 class="title">Validación del Formulario</h2>
          <p class="subtitle">Por favor, completa los siguientes campos:</p>
        </div>
      </div>

      <div class="error-list">
        <div *ngFor="let error of data.errors" class="error-item">
          <mat-icon class="error-bullet">cancel</mat-icon>
          <span class="error-text">{{ error.startsWith('❌') ? error.slice(2) : error }}</span>
        </div>
      </div>

      <div class="actions">
        <button mat-raised-button color="primary" class="primary-button" (click)="closeDialog()">Entendido</button>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .content {
      width: min(520px, 92vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      box-sizing: border-box;
    }

    .warn-icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      font-size: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #f39c12;
      background: rgba(243,156,18,0.06);
      border-radius: 8px;
      padding: 4px;
      box-sizing: border-box;
      margin-top: 0;
    }

    .title {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 700;
    }

    .subtitle {
      margin: 0 0 8px 0;
      color: rgba(0,0,0,0.65);
      font-size: 14px;
    }

    .error-list {
      max-height: 320px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 8px;
      width: 100%;
      background: rgba(0,0,0,0.02);
      border-radius: 8px;
      overflow-x: hidden;
    }

    .error-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      color: #2d3436;
      font-size: 14px;
      width: 100%;
      padding: 6px 4px;
      box-sizing: border-box;
    }

    .error-bullet { color: #d63031; }
    .error-text { line-height: 1.4; display:block; word-break: break-word; overflow-wrap: anywhere; }
    mat-icon.error-bullet {
      flex: 0 0 28px;
      height: 28px;
      width: 28px;
      font-size: 18px;
      line-height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }

    .actions { display: flex; justify-content: center; padding: 12px 0 6px; }
    .primary-button { min-width: 120px; border-radius: 999px; padding: 8px 20px; }
  `]
})
export class ValidationErrorDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { errors: string[] },
    public dialogRef: MatDialogRef<ValidationErrorDialog>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
