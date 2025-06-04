import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";

interface TutorAssignment {
  school: string;
  course: string;
  subject: string;
  tutors: string[];
  candidates: string[];
}

interface Subject {
  name: string;
  tutors: string[];
  candidates: string[];
}

interface Course {
  name: string;
  subjects: Subject[];
}

interface School {
  name: string;
  courses: Course[];
}

@Component({
  selector: 'app-monitors',
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    BackButtonComponent
],
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.scss']
})
export class ProfessorTutorsComponent implements OnInit {
  /** Dados originais — substitua pela chamada ao seu serviço */
  private assignments: TutorAssignment[] = [];

  /** Estrutura agrupada para template */
  public groupedData: School[] = [];

  ngOnInit(): void {
    // Exemplo de dados; em produção, traga do seu serviço via HTTP
    this.assignments = [
      {
        school: 'Escola Politécnica',
        course: 'Engenharia Mecânica',
        subject: 'Cálculo I',
        tutors: ['João', 'Ana'],
        candidates: ['Carlos', 'Mariana']
      },
      {
        school: 'Escola de Economia e Negócios',
        course: 'Economia e Administração',
        subject: 'Introdução à Matemática Básica',
        tutors: ['Pedro'],
        candidates: ['Luís', 'Maria']
      }
      // ... demais registros
    ];

    this.groupedData = this.transformData(this.assignments);
  }

  /**
   * Agrupa um array plano de atribuições em escolas → cursos → disciplinas.
   */
  private transformData(data: TutorAssignment[]): School[] {
    const schoolMap = new Map<string, Map<string, Subject[]>>();

    data.forEach(item => {
      if (!schoolMap.has(item.school)) {
        schoolMap.set(item.school, new Map());
      }
      const courseMap = schoolMap.get(item.school)!;

      if (!courseMap.has(item.course)) {
        courseMap.set(item.course, []);
      }
      courseMap.get(item.course)!.push({
        name: item.subject,
        tutors: item.tutors,
        candidates: item.candidates
      });
    });

    const result: School[] = [];
    schoolMap.forEach((courses, schoolName) => {
      const courseArr: Course[] = [];
      courses.forEach((subjects, courseName) => {
        courseArr.push({ name: courseName, subjects });
      });
      result.push({ name: schoolName, courses: courseArr });
    });

    return result;
  }
}
