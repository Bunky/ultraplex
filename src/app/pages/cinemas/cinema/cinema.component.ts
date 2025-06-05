import { AfterViewInit, Component, computed, effect, inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CinemasService, Screen } from '../cinemas.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, Subscription } from 'rxjs';
import { ErrorComponent } from '@/app/shared/components/error/error.component';
import { LoadingComponent } from '@/app/shared/components/loading/loading.component';
import { NoDataComponent } from '@/app/shared/components/no-data/no-data.component';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewScreenModalComponent } from './new-screen-modal/new-screen-modal.component';

@Component({
  selector: 'app-cinema',
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
  templateUrl: './cinema.component.html',
  styleUrl: './cinema.component.scss'
})
export class CinemaComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private readonly service = inject(CinemasService);
  protected readonly cinemas = injectQuery(() => this.service.cinemas(0, 100));

  // This will only work if the cinema is on the currnet page...
  // This would work a lot better with a dedicated /cinema/{id} route.
  // Or just using data binding...
  readonly cinema = computed(() => this.cinemas.data()?.content.find((c) => c.id === Number(this.route.snapshot.paramMap.get('id'))));  
  private sub = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected dataSource = new MatTableDataSource<Screen>(this.cinema()?.screens || []);
  protected displayedColumns = ['id', 'name'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.cinema()?.screens || [];
    });

    const routeWatcher = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild?.snapshot?.routeConfig?.path;
        if (child === 'new') {
          const dialogRef = this.dialog.open(NewScreenModalComponent, {
            width: '400px',
            data: this.cinema()?.id
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/cinemas', this.cinema()?.id]);
          });
        }
      });

    this.sub.add(routeWatcher);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  retry() {
    this.cinemas.refetch();
  }
}
