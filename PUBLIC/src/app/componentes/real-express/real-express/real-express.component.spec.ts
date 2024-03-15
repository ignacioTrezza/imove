import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealExpressComponent } from './real-express.component';

describe('RealExpressComponent', () => {
  let component: RealExpressComponent;
  let fixture: ComponentFixture<RealExpressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealExpressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
