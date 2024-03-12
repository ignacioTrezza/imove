import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherSubscriberComponent } from './another-subscriber.component';

describe('AnotherSubscriberComponent', () => {
  let component: AnotherSubscriberComponent;
  let fixture: ComponentFixture<AnotherSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnotherSubscriberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnotherSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
