import { ComponentFixture, TextBed } from '@angular/core/testing';
import {HeaderMenuComponent} from  './header-menu.component';

describe('HeaderMenuComponent', () => {
    let component: HeaderMenuComponent;
    let fixture: ComponentFixture<HeaderMenuComponent>;

    beforeEach(async () => {
        await TextBed.configureTesting({
            imports: [HeaderMenuComponent]
        })
        .compileComponents();

        fixture = TextBed.createComponent(HeaderMenuComponent);
        component = ComponentFixture.componentInstance;
        ComponentFixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
