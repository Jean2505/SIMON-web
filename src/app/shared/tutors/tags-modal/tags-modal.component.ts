import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tags-modal',
  imports: [FormsModule],
  templateUrl: './tags-modal.component.html',
  styleUrl: './tags-modal.component.scss'
})
export class TagsModalComponent implements OnInit{

  @Input({ required: true }) disciplineId!: string;
  @Output() cancel = new EventEmitter<boolean>();

  topics: string [] = [];
  typedTopic = '';

  constructor(
    /** Serviço HttpClient para requisições HTTP @type {HttpClient} */
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics() {
    this.http.post('http://localhost:3000/getCourseTopics', { id: this.disciplineId })
      .subscribe({
        next: (response: any) => {
          this.topics = JSON.parse(response);
          console.log(this.topics);
        },
        error: error => {
          console.error('Erro ao pegar tópicos', error);
          return;
        }
      })
  }

  addTopic(topic: string) {
    if (this.topics.includes(topic)) {
      alert('Este tópico já está adicionado!');
      return
    }

    this.topics.push(topic);
  }

  removeTopic(topic: string) {
    this.topics = this.topics.filter(str => {return str !== topic});
  }

  saveTopics() {
    this.http.post('http://localhost:3000/sendCourseTopics', 
      {
        id: this.disciplineId,
        topics: this.topics
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: error => {
          console.error('Erro ao salvar tópicos', error);
          return;
        }
      }
    )

    this.cancelModal();
  }

  cancelModal() {
    this.cancel.emit(false);
  }
}
