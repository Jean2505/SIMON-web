import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { InstHomeComponent } from "./inst-home/inst-home.component";
import { InstHeaderComponent } from "./inst-header/inst-header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, InstHomeComponent, InstHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simon-web';
}
