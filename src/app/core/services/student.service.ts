import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class StudentService {
  private apiUrl = 'http://localhost:3000/alunos';

  constructor(private http: HttpClient) {}

  getAlunos(): Observable<{ id: number; nome: string }[]> {
    return this.http.get<{ id: number; nome: string }[]>(this.apiUrl);
  }

  addAluno(nome: string): Observable<any> {
    return this.http.post(this.apiUrl, { nome });
  }
}
