import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected title = 'ultraplex';
  protected readonly isMobile = signal(false);

  protected navigation = [
    {
      name: 'Dashboard',
      link: '/'
    },
    {
      name: 'Movies',
      link: '/movies'
    },
    {
      name: 'Cinemas',
      link: '/cinemas'
    }
  ];

}
