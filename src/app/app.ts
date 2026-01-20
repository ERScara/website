import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderMenuComponent } from './core/header-menu.component';


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderMenuComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App  {
  protected title = 'website';

}
