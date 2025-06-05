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
  readonly loading = input<boolean>(false);
  readonly icon = input<string>('save');
  readonly type = input<string>('button');
  readonly disabled = input<boolean>(false);
}
