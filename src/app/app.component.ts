import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { InstHomeComponent } from "./inst-home/inst-home.component";
import { InstHeaderComponent } from "./inst-header/inst-header.component";
import { InstManageComponent } from "./inst-manage/inst-manage.component";
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, InstHomeComponent, InstHeaderComponent, InstManageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, AfterViewInit {
  constructor(private databaseService: DatabaseService) {}
  title = 'simon-web';

  async ngAfterViewInit() {
    await this.databaseService.InitializeDatabase();
  }

  async ngOnDestroy() {
    await this.databaseService.closeDatabase();
  }
}
