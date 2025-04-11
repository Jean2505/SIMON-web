import { Component, EventEmitter, Input, Output } from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

 interface Escola {
  escolaId: string;
  name: string;
}

interface Curso {
  cursoId: string;
  escolaId: string;
  name: string;
  disciplines: string[];
}

@Component({
  selector: 'app-inst-manage',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './inst-manage.component.html',
  styleUrl: './inst-manage.component.scss'
})
export class InstManageComponent {
  @Input({required:true}) escola!: Escola;
  @Input({required:true}) curso!: Curso;

  selectedEscolaId?: string;

  escolas: Escola[] = [
    {escolaId: '01', name: 'Escola Politécnica'},
    {escolaId: '02', name: 'Escola de Economia e Negócios'},
    {escolaId: '03', name: 'Escola de Linguagem e Comunicação'}
  ];

  cursos: Curso[] =[
    {cursoId: 'c01', escolaId: '01', name: 'Engenharia de Software', disciplines: []},
    {cursoId: 'c02', escolaId: '02', name: 'Administração', disciplines: []},
    {cursoId: 'c03', escolaId: '03', name: 'Jornalismo', disciplines: []},
    {cursoId: 'c04', escolaId: '01', name: 'Engenharia Civil', disciplines: []},
    {cursoId: 'c05', escolaId: '02', name: 'Ciências Contábeis', disciplines: []},
    {cursoId: 'c06', escolaId: '01', name: 'Cibersegurança', disciplines: []},
    {cursoId: 'c07', escolaId: '03', name: 'Letras', disciplines: []},
    {cursoId: 'c08', escolaId: '01', name: 'Engenharia de Computação', disciplines: []}
  ]

  cursosAparentes: Curso [] = [];

  onSelectEscola(escolaId: string) {
    console.log('Entrou')
    console.log(escolaId)
    this.cursosAparentes = this.cursos.filter(curso => curso.escolaId === escolaId)
    console.log(this.cursosAparentes);
  }

  onKey() {

  }

}
