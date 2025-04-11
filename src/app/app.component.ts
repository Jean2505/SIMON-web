import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { InstHomeComponent } from "./inst-home/inst-home.component";
import { InstHeaderComponent } from "./inst-header/inst-header.component";
import { InstManageComponent } from "./inst-manage/inst-manage.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, InstHomeComponent, InstHeaderComponent, InstManageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simon-web';
}
