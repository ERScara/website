import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capitulo1 } from './capitulo1';

describe('Capitulo1', () => {
  let component: Capitulo1;
  let fixture: ComponentFixture<Capitulo1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capitulo1],
    }).compileComponents();

    fixture = TestBed.createComponent(Capitulo1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
