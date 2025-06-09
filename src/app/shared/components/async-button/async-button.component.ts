import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-async-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './async-button.component.html',
  styleUrl: './async-button.component.scss'
})
export class AsyncButtonComponent {
  readonly loading = input.required<boolean>();
  readonly icon = input.required<string>();
  readonly type = input.required<string>();
  readonly disabled = input.required<boolean>();
}
