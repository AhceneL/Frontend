import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviProgressionComponent } from './suivi-progression.component';

describe('SuiviProgressionComponent', () => {
  let component: SuiviProgressionComponent;
  let fixture: ComponentFixture<SuiviProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviProgressionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
