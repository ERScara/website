import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityList } from './community-list';

describe('CommunityList', () => {
  let component: CommunityList;
  let fixture: ComponentFixture<CommunityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityList],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
