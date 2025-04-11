import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTacheGestComponent } from './detail-tache-gest.component';

describe('DetailTacheGestComponent', () => {
  let component: DetailTacheGestComponent;
  let fixture: ComponentFixture<DetailTacheGestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTacheGestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTacheGestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
