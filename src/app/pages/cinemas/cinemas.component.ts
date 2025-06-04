import { Component, inject, AfterViewInit, ViewChild, signal, effect } from '@angular/core';
import { Cinema, CinemasService } from './cinemas.service';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cinemas',
  imports: [MatTableModule, MatPaginatorModule, LoadingComponent, ErrorComponent, NoDataComponent, MatButtonModule, MatIconModule],
  templateUrl: './cinemas.component.html',
  styleUrl: './cinemas.component.scss'
})
export class CinemasComponent implements AfterViewInit {
  readonly queryClient = inject(QueryClient)
  private readonly service = inject(CinemasService);

  constructor() {
    effect(() => {
      const content = this.cinemas.data()?.content ?? [];
      this.dataSource.data = content;
    });
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
