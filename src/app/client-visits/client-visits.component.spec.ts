import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVisitsComponent } from './client-visits.component';

describe('ClientVisitsComponent', () => {
  let component: ClientVisitsComponent;
  let fixture: ComponentFixture<ClientVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientVisitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
