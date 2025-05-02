import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [ CommonModule, SideBarComponent, RouterOutlet ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {

}
