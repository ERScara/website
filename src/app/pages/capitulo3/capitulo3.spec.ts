import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capitulo3 } from './capitulo3';

describe('Capitulo3', () => {
  let component: Capitulo3;
  let fixture: ComponentFixture<Capitulo3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capitulo3],
    }).compileComponents();

    fixture = TestBed.createComponent(Capitulo3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
