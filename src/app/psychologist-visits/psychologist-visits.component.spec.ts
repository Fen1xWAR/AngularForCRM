import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologistVisitsComponent } from './psychologist-visits.component';

describe('PsychologistVisitsComponent', () => {
  let component: PsychologistVisitsComponent;
  let fixture: ComponentFixture<PsychologistVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsychologistVisitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsychologistVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
