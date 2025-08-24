import { Component, Input } from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { Tutor } from '../../../models/tutor.model';

@Component({
  selector: 'app-request-item',
  imports: [MatExpansionModule],
  templateUrl: './request-item.component.html',
  styleUrl: './request-item.component.scss'
})
export class RequestItemComponent {

  @Input({ required: true }) request!: Tutor; 

  /** Loading state for approval actions */
  loadingResult: boolean = false;

  sendResult(result: number, uid: string, disciplinaId: string): void {
    
  }
}
