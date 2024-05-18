import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologistCardComponent } from './psychologist-card.component';

describe('PsychologistCardComponent', () => {
  let component: PsychologistCardComponent;
  let fixture: ComponentFixture<PsychologistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsychologistCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsychologistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
