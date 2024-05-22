import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingModalComponent } from './booking-modal.component';

describe('ModalComponent', () => {
  let component: BookingModalComponent;
  let fixture: ComponentFixture<BookingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
