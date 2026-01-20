import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capitulo2 } from './capitulo2';

describe('Capitulo2', () => {
  let component: Capitulo2;
  let fixture: ComponentFixture<Capitulo2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capitulo2],
    }).compileComponents();

    fixture = TestBed.createComponent(Capitulo2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
