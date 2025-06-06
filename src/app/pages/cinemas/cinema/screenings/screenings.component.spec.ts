import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningsComponent } from './screenings.component';

describe('ScreeningsComponent', () => {
  let component: ScreeningsComponent;
  let fixture: ComponentFixture<ScreeningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreeningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreeningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
