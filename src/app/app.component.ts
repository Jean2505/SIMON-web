import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./shared/login/login.component";
import { InstHomeComponent } from "./institution/home/home.component";
import { InstHeaderComponent } from "./institution/header/header.component";
import { InstManageComponent } from "./institution/manage-subjects/manage-subjects.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, InstHomeComponent, InstHeaderComponent, InstManageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simon-web';
}
