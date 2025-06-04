import { Component, inject, AfterViewInit, ViewChild, signal, effect, OnDestroy } from '@angular/core';
import { Cinema, CinemasService } from './cinemas.service';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoadingComponent } from '@components/loading/loading.component';
import { ErrorComponent } from '@components/error/error.component';
import { NoDataComponent } from '@components/no-data/no-data.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewCinemaModalComponent } from './new-cinema-modal/new-cinema-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-cinemas',
  imports: [MatTableModule, MatPaginatorModule, LoadingComponent, ErrorComponent, NoDataComponent, MatButtonModule, MatIconModule, RouterModule, RouterOutlet],
  templateUrl: './cinemas.component.html',
  styleUrl: './cinemas.component.scss'
})
export class CinemasComponent implements AfterViewInit, OnDestroy {
  readonly queryClient = inject(QueryClient)
  private readonly service = inject(CinemasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private sub = new Subscription();

  constructor() {
    effect(() => {
      const content = this.cinemas.data()?.content ?? [];
      this.dataSource.data = content;
    });

    const routeWatcher = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild?.snapshot?.routeConfig?.path;
        if (child === 'new') {
          const dialogRef = this.dialog.open(NewCinemaModalComponent, {
            width: '400px'
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/cinemas']);
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
  protected readonly cinemas = injectQuery(() => this.service.cinemas(this.page(), 20));
  protected dataSource = new MatTableDataSource<Cinema>(this.cinemas.data()?.content || []);
  protected displayedColumns = ['id', 'name'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
  }

  retry() {
    this.cinemas.refetch();
  }
}
