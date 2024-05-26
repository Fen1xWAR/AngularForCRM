import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForClientComponent } from './for-client.component';

describe('ForClientComponent', () => {
  let component: ForClientComponent;
  let fixture: ComponentFixture<ForClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
