import { Component, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firma-pad',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './firma-pad.html',
  styleUrls: ['./firma-pad.css']
})
export class FirmaPad implements AfterViewInit, OnDestroy {

  @Input() label = 'Firma';

  @Output() firmaChange = new EventEmitter<string>();

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private resizeObserver?: ResizeObserver;
  private cssWidth = 0;
  private cssHeight = 0;

  hasDrawn = false;
  uploadedImage: string | null = null;

  get firmado(): boolean {
    return this.hasDrawn || !!this.uploadedImage;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // The canvas may be inside a hidden stepper step (width/height = 0 at init).
    // A ResizeObserver sizes it correctly as soon as it becomes visible,
    // and keeps it correct on window resize / orientation change.
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0 && (width !== this.cssWidth || height !== this.cssHeight)) {
            this.resizeCanvas(width, height);
          }
        }
      });
      this.resizeObserver.observe(canvas);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private resizeCanvas(width: number, height: number): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;

    // Preserve the current drawing (if any) before resizing wipes the canvas.
    // This must happen synchronously: an async (data URL + Image.onload) round
    // trip can lose the race against a second resize firing before the reload
    // completes, silently blanking the canvas while `hasDrawn` stays true.
    let snapshot: HTMLCanvasElement | null = null;
    if (this.hasDrawn && canvas.width > 0 && canvas.height > 0) {
      snapshot = document.createElement('canvas');
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext('2d')!.drawImage(canvas, 0, 0);
    }

    this.cssWidth = width;
    this.cssHeight = height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // Scale so drawing coordinates are in CSS pixels (crisp on retina screens)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.paintBackground();
    this.configureStroke();

    if (snapshot) {
      this.ctx.drawImage(snapshot, 0, 0, width, height);
    }
  }

  private paintBackground(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.ctx.restore();
  }

  private configureStroke(): void {
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#000000';
  }

  // Pointer events unify mouse, touch and stylus (no TouchEvent checks needed)
  startDraw(event: PointerEvent) {
    if (this.uploadedImage) return;
    event.preventDefault();

    const canvas = this.canvasRef.nativeElement;
    // Keep receiving move events even if the pointer leaves the canvas
    canvas.setPointerCapture(event.pointerId);

    this.drawing = true;
    this.ctx.beginPath();
    const { x, y } = this.getPos(event);
    this.ctx.moveTo(x, y);
    // Draw a dot for single taps/clicks
    this.ctx.lineTo(x + 0.1, y + 0.1);
    this.ctx.stroke();

    if (!this.hasDrawn) {
      this.hasDrawn = true;
      this.cdr.detectChanges();
    }
  }

  draw(event: PointerEvent) {
    if (!this.drawing) return;
    event.preventDefault();

    const { x, y } = this.getPos(event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  endDraw(event: PointerEvent) {
    if (!this.drawing) return;
    this.drawing = false;

    const canvas = this.canvasRef.nativeElement;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    this.emitirFirma();
  }

  private getPos(event: PointerEvent): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  limpiar() {
    this.paintBackground();
    this.configureStroke();
    this.uploadedImage = null;
    this.hasDrawn = false;
    this.drawing = false;

    // Emitir vacío si se limpia
    this.firmaChange.emit('');
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64 = e.target?.result as string;
        this.uploadedImage = base64;
        this.hasDrawn = false;

        // Clear canvas with white background
        this.paintBackground();
        this.configureStroke();

        // Emitir imagen
        this.firmaChange.emit(base64);

        // Limpiar el input
        input.value = '';
      };

      reader.readAsDataURL(file);
    }
  }

  obtenerFirmaBase64(): string {
    if (this.uploadedImage) {
      return this.uploadedImage;
    }
    if (!this.hasDrawn) {
      return '';
    }
    return this.canvasRef.nativeElement.toDataURL('image/png');
  }

  private emitirFirma(): void {
    const base64 = this.obtenerFirmaBase64();
    this.firmaChange.emit(base64);
  }
}
