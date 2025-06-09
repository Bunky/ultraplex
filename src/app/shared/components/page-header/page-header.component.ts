import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

export interface Breadcrumb {
  label: string;
  route?: (string | number)[];
};

@Component({
  selector: 'app-page-header',
  imports: [MatButtonModule, MatIconModule, RouterModule, MatTooltipModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  readonly title = input<string>();
  readonly breadcrumbs = input<Breadcrumb[]>();
  readonly refresh = input<() => void | undefined>();

  protected handleRefresh(): void {
    this.refresh()?.();
  }
}
