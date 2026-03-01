import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityCreate } from './community-create';

describe('CommunityCreate', () => {
  let component: CommunityCreate;
  let fixture: ComponentFixture<CommunityCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
