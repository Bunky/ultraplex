import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  readonly header = input<string>('Error');
  readonly description = input<string>('Please try again later.');
  readonly retry = input<() => void>(() => {
    console.warn('Retry function not provided');
  });

  protected handleClick(): void {
    this.retry()();
  }
}
