import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { type Monitor } from "../../models/monitor.model"
import { MonitorsComponent } from "./monitors/monitors.component";
import { DUMMY_MONITORS } from './monitors/dummy-monitors';

@Component({
  selector: 'app-subject',
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MonitorsComponent
],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class StudentSubjectComponent {
  monitors = DUMMY_MONITORS;

}
