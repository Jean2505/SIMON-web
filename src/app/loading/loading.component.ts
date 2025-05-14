import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class ProgressWithGifComponent implements OnInit {
  progress = 0;

  ngOnInit(): void {
    const interval = setInterval(() => {
      if (this.progress >= 100) {
        clearInterval(interval);
      } else {
        this.progress += 1;
      }
    }, 100);
  }
}
