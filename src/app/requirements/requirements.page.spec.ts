import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementsPage } from './requirements.page';

describe('RequirementsPage', () => {
  let component: RequirementsPage;
  let fixture: ComponentFixture<RequirementsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
