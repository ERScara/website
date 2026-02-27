import { Routes } from '@angular/router';
import { NewPass } from './core/new-pass/new-pass';
import { Inicio } from './pages/Inicio/Inicio';
import { About } from './pages/Inicio/about/about';
import { Login } from './core/auth/login';
import { Account } from './core/account/account';
import { Support } from './core/support/support';
import { AcercaDe } from './pages/capitulo1/capitulo1';
import { Comunidades } from './pages/capitulo2/capitulo2'
import { Modelos } from './pages/capitulo3/capitulo3';
import { Avanzado } from './pages/capitulo4/capitulo4';
import { Diseño } from './pages/capitulo5/capitulo5';
import { SalaComun } from './pages/capitulo6/capitulo6';

export const appRoutes: Routes = [{ path: 'Inicio', component: Inicio, pathMatch:'full'}, 
                                  { path: 'login', component: Login, pathMatch:'full'}, 
                                  { path: 'new-pass', component: NewPass, pathMatch:'full'}, 
                                  { path: 'new-pass/:uid/:token', component: NewPass, pathMatch:'full'}, 
                                  { path: 'support', component: Support, pathMatch:'full'},  
                                  { path: 'account', component: Account, pathMatch:'full'}, 
                                  { path: 'about', component: About, pathMatch:'full'},
                                  { path:'acerca-de', component: AcercaDe, pathMatch:'full'},
                                  { path:'comunidades', component: Comunidades, pathMatch:'full'},
                                  { path:'modelos', component: Modelos, pathMatch:'full'},
                                  { path:'avanzado', component: Avanzado, pathMatch:'full'},
                                  { path:'diseño', component: Diseño, pathMatch:'full'},
                                  { path:'sala-comun', component: SalaComun, pathMatch:'full'},
                                  {path:'', redirectTo:'Inicio', pathMatch:'full'}];
