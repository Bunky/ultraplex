import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCinemaModalComponent } from './new-cinema-modal.component';

describe('NewCinemaModalComponent', () => {
  let component: NewCinemaModalComponent;
  let fixture: ComponentFixture<NewCinemaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCinemaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCinemaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
