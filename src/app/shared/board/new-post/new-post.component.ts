import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  imports: [FormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {

  @Output() close = new EventEmitter<void>();

  files: string [] = [];
  images: string [] = [];

  enteredTitle = '';
  enteredContent = '';
  enteredUrl = '';

  isAttaching = false;
  isAddingUrl = false;

  onCancel(){
    this.close.emit();
  }

  onSelectAttach() {
    this.isAttaching = true;
  }

  onselectAddUrl() {
    this.isAddingUrl = true;
  }
}
