import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-inst-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inst-home.component.html',
  styleUrls: ['./inst-home.component.scss']
})
export class InstHomeComponent implements OnInit {
  alunoService = inject(StudentService);
  alunos: { id: number; nome: string }[] = [];

  ngOnInit(): void {
    this.alunoService.getAlunos().subscribe(data => {
      this.alunos = data;
      console.log('Alunos encontrados no banco:', data);
    });
  }

  adicionar(nome: string): void {
    this.alunoService.addAluno(nome).subscribe(() => {
      this.ngOnInit();
    });
  }
}