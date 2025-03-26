import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { InstHomeComponent } from "./inst-home/inst-home.component";
import { InstHomeHeaderComponent } from "./inst-home-header/inst-home-header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, InstHomeComponent, InstHomeHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simon-web';
}
