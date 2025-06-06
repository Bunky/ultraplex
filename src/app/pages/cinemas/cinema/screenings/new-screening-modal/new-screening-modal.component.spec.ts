import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScreeningModalComponent } from './new-screening-modal.component';

describe('NewScreeningModalComponent', () => {
  let component: NewScreeningModalComponent;
  let fixture: ComponentFixture<NewScreeningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewScreeningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewScreeningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
