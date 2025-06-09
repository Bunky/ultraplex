import { ErrorComponent } from '@/app/shared/components/error/error.component';
import { LoadingComponent } from '@/app/shared/components/loading/loading.component';
import { NoDataComponent } from '@/app/shared/components/no-data/no-data.component';
import { Breadcrumb, PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { AfterViewInit, Component, computed, effect, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Subscription, filter } from 'rxjs';
import { CinemasService, Screening } from '../../cinemas.service';
import { DatePipe } from '@angular/common';
import { NewScreeningModalComponent } from './new-screening-modal/new-screening-modal.component';

// This would probably be better as a calendar view apposed to a table.
@Component({
  selector: 'app-screenings',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    LoadingComponent,
    ErrorComponent,
    NoDataComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    PageHeaderComponent,
    DatePipe
  ],
  templateUrl: './screenings.component.html',
  styleUrl: './screenings.component.scss'
})
export class ScreeningsComponent implements AfterViewInit, OnDestroy {
  constructor() {
    effect(() => {
      this.dataSource.data = this.filteredScreenings() || [];
    });

    const routeWatcher = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild?.snapshot?.routeConfig?.path;
        if (child === 'new') {
          const dialogRef = this.dialog.open(NewScreeningModalComponent, {
            width: '400px',
            data: {
              cinema: this.cinema(),
              screen: this.screen()
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/cinemas', this.cinema()?.id, 'screenings', this.screen()?.id]);
          });
        }
      });

    this.sub.add(routeWatcher);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly service = inject(CinemasService);

  private readonly cinemas = injectQuery(() => this.service.cinemas(0, 100));
  private readonly cinema = computed(() => this.cinemas.data()?.content.find((c) => c.id === Number(this.route.snapshot.paramMap.get('cinemaId'))));  
  private readonly screen = computed(() => this.cinema()?.screens.find((s) => s.id === Number(this.route.snapshot.paramMap.get('screenId'))));

  protected readonly screenings = injectQuery(() => this.service.screenings(this.cinema()?.id || 0));
  protected readonly filteredScreenings = computed(() => this.screenings.data()?.content.filter((s) => s.screenName === this.screen()?.name));
  protected dataSource = new MatTableDataSource<Screening>([]);
  protected displayedColumns = ['movie', 'start'];
  private sub = new Subscription();

  protected readonly breadcrumbs = computed<Breadcrumb[]>(() => [
    {
      label: 'Cinemas',
      route: ['/cinemas']
    },
    {
      label: this.cinema()?.name || 'Loading...',
      route: ['/cinemas', this.cinema()?.id ?? 0]
    }, {
      label: this.screen()?.name || 'Loading...'
    }
  ]);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  protected retry(): void {
    this.screenings.refetch();
  }
}
