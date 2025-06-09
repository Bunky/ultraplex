import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly router = inject(Router);

  protected title = 'ultraplex';
  protected readonly isMobile = signal(false);

  protected navigation = [
    {
      name: 'Dashboard',
      link: '/',
      icon: 'dashboard'
    },
    {
      name: 'Movies',
      link: '/movies',
      icon: 'movie'
    },
    {
      name: 'Cinemas',
      link: '/cinemas',
      icon: 'storefront'
    }
  ];

  protected isRouteActive(routeLink: string): boolean {
    if (routeLink === '/') {
      return this.router.url === '/';
    }
    return this.router.url.startsWith(routeLink);
  }
}
