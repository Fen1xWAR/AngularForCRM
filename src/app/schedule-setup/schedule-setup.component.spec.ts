import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSetupComponent } from './schedule-setup.component';

describe('ScheduleSetupComponent', () => {
  let component: ScheduleSetupComponent;
  let fixture: ComponentFixture<ScheduleSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
