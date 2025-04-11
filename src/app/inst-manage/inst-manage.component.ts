import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

import { DisciplineComponent } from "./discipline/discipline.component";
import { DUMMY_DISCIPLINES } from './dummy-disciplines';

 interface Escola {
  escolaId: string;
  name: string;
}

interface Curso {
  cursoId: string;
  escolaId: string;
  name: string;
}

@Component({
  selector: 'app-inst-manage',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, FormsModule, DisciplineComponent],
  templateUrl: './inst-manage.component.html',
  styleUrl: './inst-manage.component.scss'
})
export class InstManageComponent {
  @Input({required:true}) escola!: Escola;
  @Input({required:true}) curso!: Curso;

  disciplines = DUMMY_DISCIPLINES;
  selectedEscolaId?: string;

  escolas: Escola[] = [
    {escolaId: '01', name: 'Escola Politécnica'},
    {escolaId: '02', name: 'Escola de Economia e Negócios'},
    {escolaId: '03', name: 'Escola de Linguagem e Comunicação'}
  ];

  cursos: Curso[] =[
    {cursoId: 'c01', escolaId: '01', name: 'Engenharia de Software'},
    {cursoId: 'c02', escolaId: '02', name: 'Administração'},
    {cursoId: 'c03', escolaId: '03', name: 'Jornalismo'},
    {cursoId: 'c04', escolaId: '01', name: 'Engenharia Civil'},
    {cursoId: 'c05', escolaId: '02', name: 'Ciências Contábeis'},
    {cursoId: 'c06', escolaId: '01', name: 'Cibersegurança'},
    {cursoId: 'c07', escolaId: '03', name: 'Letras'},
    {cursoId: 'c08', escolaId: '01', name: 'Engenharia de Computação'}
  ]

  cursosAparentes: Curso [] = [];

  onSelectEscola(escolaId: string) {
    this.cursosAparentes = this.cursos.filter(curso => curso.escolaId === escolaId)
  }
}
