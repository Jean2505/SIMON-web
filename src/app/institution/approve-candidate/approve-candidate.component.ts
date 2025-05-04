import { Component } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

import { type Enlistment } from '../../models/enlistment.model';
import { DUMMY_CANDIDATURAS } from './dummy-candidatura';


@Component({
  selector: 'app-approve-candidate',
  imports: [MatExpansionModule],
  templateUrl: './approve-candidate.component.html',
  styleUrl: './approve-candidate.component.scss'
})
export class ApproveCandidateComponent {

  enlistments = DUMMY_CANDIDATURAS;
  enlistment?: Enlistment;

  onRejection() {

  }

  onApproval() {

  }
}
