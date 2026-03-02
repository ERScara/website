import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capitulo5 } from './diseño';

describe('Capitulo5', () => {
  let component: Capitulo5;
  let fixture: ComponentFixture<Capitulo5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capitulo5],
    }).compileComponents();

    fixture = TestBed.createComponent(Capitulo5);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
