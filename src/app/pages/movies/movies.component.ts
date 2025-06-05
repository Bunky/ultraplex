import { AfterViewInit, Component, effect, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { QueryClient, injectQuery } from '@tanstack/angular-query-experimental';
import { Subscription, filter } from 'rxjs';
import { Movie, MoviesService } from './movies.service';
import { ErrorComponent } from '@/app/shared/components/error/error.component';
import { LoadingComponent } from '@/app/shared/components/loading/loading.component';
import { NoDataComponent } from '@/app/shared/components/no-data/no-data.component';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewMovieModalComponent } from './new-movie-modal/new-movie-modal.component';

@Component({
  selector: 'app-movies',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    LoadingComponent,
    ErrorComponent,
    NoDataComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    PageHeaderComponent
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements AfterViewInit, OnDestroy {
readonly queryClient = inject(QueryClient)
  private readonly service = inject(MoviesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private sub = new Subscription();

  constructor() {
    effect(() => {
      const content = this.movies.data()?.content ?? [];
      this.dataSource.data = content;
    });

    const routeWatcher = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild?.snapshot?.routeConfig?.path;
        if (child === 'new') {
          const dialogRef = this.dialog.open(NewMovieModalComponent, {
            width: '400px'
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/movies']);
          });
        }
      });

    this.sub.add(routeWatcher);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly page = signal(0);
  protected readonly movies = injectQuery(() => this.service.movies(this.page(), 20));
  protected dataSource = new MatTableDataSource<Movie>(this.movies.data()?.content || []);
  protected displayedColumns = ['id', 'name', 'runtime'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
  }

  retry() {
    this.movies.refetch();
  }
}
