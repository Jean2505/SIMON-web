import { Component, Input } from '@angular/core';

import { type Monitor } from "../../../models/monitor.model";

@Component({
  selector: 'app-monitors',
  imports: [],
  templateUrl: './monitors.component.html',
  styleUrl: './monitors.component.scss'
})
export class MonitorsComponent {
  @Input() monitor?: Monitor;
}
