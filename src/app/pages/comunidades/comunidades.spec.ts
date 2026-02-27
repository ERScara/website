import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comunidades } from './comunidades';

describe('Capitulo2', () => {
  let component: Comunidades;
  let fixture: ComponentFixture<Comunidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comunidades],
    }).compileComponents();

    fixture = TestBed.createComponent(Comunidades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
