import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

import { DisciplineComponent } from "./discipline/discipline.component";
import { DUMMY_DISCIPLINES } from './dummy-disciplines';
import { Discipline } from './discipline/discipline.model';

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
  // @Input({required:true}) disciplina!: Discipline;

  // disciplines = DUMMY_DISCIPLINES;
  selectedEscolaId?: string;
  selectedCursoId!: string;
  cursosAparentes: Curso [] = [];
  disciplinasAparentes: Discipline [] = [];

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

  disciplinas: Discipline [] = [
    {
      id: 'd01',
      cursoId: 'c01',
      name: 'Algoritmos e Estruturas de Dados',
      lecturer: 'Prof. Ana Costa',
      term: '2',
      monitorAmnt: '0'
    },
    {
      id: 'd02',
      cursoId: 'c03',
      name: 'Mídias, Narrativas e Imagética',
      lecturer: 'Prof. Carlos Lima',
      term: '3',
      monitorAmnt: '0'
    },
    {
      id: 'd03',
      cursoId: 'c02',
      name: 'Microeconomia Aplicada',
      lecturer: 'Prof. João Silva',
      term: '2',
      monitorAmnt: '0'
    },
    {
      id: 'd04',
      cursoId: 'c04',
      name: 'Projeto de Estradas',
      lecturer: 'Prof. João Silva',
      term: '6',
      monitorAmnt: '0'
    },
    {
      id: 'd05',
      cursoId: 'c05',
      name: 'Contabilidade Setorial',
      lecturer: 'Prof. João Silva',
      term: '8',
      monitorAmnt: '0'
    },
    {
      id: 'd06',
      cursoId: 'c06',
      name: 'Contabilidade Setorial',
      lecturer: 'Prof. João Silva',
      term: '8',
      monitorAmnt: '0'
    },
  ];

  onSelectEscola(escolaId: string) {
    this.cursosAparentes = this.cursos.filter(curso => curso.escolaId === escolaId)
  }

  onSelectCurso(cursoId: string) {
    this.disciplinasAparentes = this.disciplinas.filter(disciplina => disciplina.cursoId === cursoId);
    this.selectedCursoId = cursoId;
  }

  get selectedCurso() {
    return this.cursos.find((curso) => curso.cursoId === this.selectedCursoId);
  }

  onLoadCourses(){
    
  }
}
