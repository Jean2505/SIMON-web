import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
  selector: 'app-report-item',
  imports: [MatExpansionModule, DatePipe],
  templateUrl: './report-item.component.html',
  styleUrl: './report-item.component.scss'
})
export class ReportItemComponent {

  @Input({ required: true }) report: any;

}
