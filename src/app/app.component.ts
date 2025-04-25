import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonitorsComponent } from "./student/subject/monitors/monitors.component";
import { StudentSubjectComponent } from "./student/subject/subject.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MonitorsComponent, StudentSubjectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simon-web';
}
