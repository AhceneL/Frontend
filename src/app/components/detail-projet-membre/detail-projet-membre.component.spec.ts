import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjetMembreComponent } from './detail-projet-membre.component';

describe('DetailProjetMembreComponent', () => {
  let component: DetailProjetMembreComponent;
  let fixture: ComponentFixture<DetailProjetMembreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProjetMembreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProjetMembreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
