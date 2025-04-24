import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subject',
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class StudentSubjectComponent {

}
