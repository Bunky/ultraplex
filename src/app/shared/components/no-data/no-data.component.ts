import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-data',
  imports: [MatIconModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {
  readonly message = input<string>('No data available.');
  readonly height = input<string>('100%');
}
