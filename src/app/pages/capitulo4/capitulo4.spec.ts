import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capitulo4 } from './capitulo4';

describe('Capitulo4', () => {
  let component: Capitulo4;
  let fixture: ComponentFixture<Capitulo4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capitulo4],
    }).compileComponents();

    fixture = TestBed.createComponent(Capitulo4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
