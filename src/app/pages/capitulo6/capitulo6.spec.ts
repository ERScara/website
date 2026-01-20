import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capitulo6 } from './capitulo6';

describe('Capitulo6', () => {
  let component: Capitulo6;
  let fixture: ComponentFixture<Capitulo6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capitulo6],
    }).compileComponents();

    fixture = TestBed.createComponent(Capitulo6);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
