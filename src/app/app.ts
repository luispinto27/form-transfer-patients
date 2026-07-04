import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Registro } from './modules/traslado/pages/registro/registro';


@Component({
  selector: 'app-root',
  imports: [Registro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('form-ambulancias-247');
}
