import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MediaMatcher } from '@angular/cdk/layout';

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
export class AppComponent implements OnDestroy {
  constructor() {
    const media = inject(MediaMatcher);

    this.mediaQuery = media.matchMedia('(max-width: 768px)');
    this.isMobile.set(this.mediaQuery.matches);
    this.open.set(!this.mediaQuery.matches);

    this.mediaQueryListener = () => {
      this.isMobile.set(this.mediaQuery.matches)
      this.open.set(!this.mediaQuery.matches);
    };
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  private readonly mediaQuery: MediaQueryList;
  private readonly mediaQueryListener: () => void;

  protected readonly router = inject(Router);

  protected title = 'ultraplex';
  protected readonly isMobile = signal(false);
  protected readonly open = signal(false);

  ngOnDestroy(): void {
    this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
  }

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

  protected toggleSidebar(): void {
    this.open.set(!this.open());
  }
}
