import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprodComponent } from './reprod.component';

describe('ReprodComponent', () => {
  let component: ReprodComponent;
  let fixture: ComponentFixture<ReprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
