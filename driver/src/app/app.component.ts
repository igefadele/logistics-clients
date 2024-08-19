import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrackerComponent } from './tracker/tracker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tracker';
}
