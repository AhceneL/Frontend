import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTacheMembreComponent } from './detail-tache-membre.component';

describe('DetailTacheMembreComponent', () => {
  let component: DetailTacheMembreComponent;
  let fixture: ComponentFixture<DetailTacheMembreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTacheMembreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTacheMembreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
