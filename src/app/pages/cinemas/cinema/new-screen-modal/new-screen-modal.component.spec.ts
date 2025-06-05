import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScreenModalComponent } from './new-screen-modal.component';

describe('NewScreenModalComponent', () => {
  let component: NewScreenModalComponent;
  let fixture: ComponentFixture<NewScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewScreenModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
