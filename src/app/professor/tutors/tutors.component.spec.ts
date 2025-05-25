import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorTutorsComponent } from './tutors.component';
import { By } from '@angular/platform-browser';

describe('ProfessorTutorsComponent', () => {
  let component: ProfessorTutorsComponent;
  let fixture: ComponentFixture<ProfessorTutorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorTutorsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorTutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara o ngOnInit e o binding
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar uma tabela com disciplinas quando groupedData não está vazio', () => {
    const tableElement = fixture.debugElement.query(By.css('table.subject-table'));
    expect(tableElement).toBeTruthy(); // Verifica se a tabela foi renderizada

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBeGreaterThan(0); // Deve haver ao menos uma linha renderizada
  });

  it('deve mostrar a mensagem de fallback quando não houver dados', () => {
    component['assignments'] = []; // Zera os dados
    component.groupedData = [];    // Zera os dados agrupados
    fixture.detectChanges();

    const fallbackText = fixture.debugElement.nativeElement.textContent;
    expect(fallbackText).toContain('Não há disciplinas cadastradas para este professor.');
  });

  it('deve agrupar corretamente os dados de entrada em escolas, cursos e disciplinas', () => {
    const grouped = component['transformData']([
      {
        school: 'Escola Teste',
        course: 'Curso Teste',
        subject: 'Matéria Teste',
        tutors: ['Aluno A'],
        candidates: ['Candidato B']
      }
    ]);

    expect(grouped.length).toBe(1);
    expect(grouped[0].name).toBe('Escola Teste');
    expect(grouped[0].courses.length).toBe(1);
    expect(grouped[0].courses[0].subjects[0].name).toBe('Matéria Teste');
  });
});

