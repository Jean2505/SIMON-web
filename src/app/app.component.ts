import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressWithGifComponent } from "./loading/loading.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressWithGifComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simon-web';
}
