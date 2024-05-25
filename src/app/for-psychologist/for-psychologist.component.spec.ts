import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForPsychologistComponent } from './for-psychologist.component';

describe('ForPsychologistComponent', () => {
  let component: ForPsychologistComponent;
  let fixture: ComponentFixture<ForPsychologistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForPsychologistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForPsychologistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
