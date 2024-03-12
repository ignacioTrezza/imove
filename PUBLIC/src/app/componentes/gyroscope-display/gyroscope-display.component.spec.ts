import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GyroscopeDisplayComponent } from './gyroscope-display.component';

describe('GyroscopeDisplayComponent', () => {
  let component: GyroscopeDisplayComponent;
  let fixture: ComponentFixture<GyroscopeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GyroscopeDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GyroscopeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
