import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from 'C:/Users/esteb/Python/SOA_Projects/website/src/app/service/auth.service'
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header-menu',
    standalone: true,
    imports: [ CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './header-menu.component.html',
    styleUrl: './header-menu.component.scss',
    providers: [AuthService]
})
export class HeaderMenuComponent {
    public authService = inject(AuthService);
    public readonly menuItems = [
        {label: 'Inicio', route:'/'},
        {label: 'Capítulo N°1', route:'/Capitulo1'},
        {label: 'Capítulo N°2', route:'/Capitulo2'},
        {label: 'Capítulo N°3', route:'/Capitulo3'},
        {label: 'Capítulo N°4', route:'/Capitulo4'},
        {label: 'Capítulo N°5', route:'/Capitulo5'},
        {label: 'Capítulo N°6', route:'/Capitulo6'},
    ]
}