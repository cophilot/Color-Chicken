import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSettingsComponent } from './value-settings.component';

describe('ValueSettingsComponent', () => {
  let component: ValueSettingsComponent;
  let fixture: ComponentFixture<ValueSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValueSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValueSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
