import { Routes } from '@angular/router';
import { NewPass } from './core/new-pass/new-pass';
import { Inicio } from './pages/Inicio/Inicio';
import { About } from './pages/Inicio/about/about';
import { Login } from './core/auth/login';
import { Account } from './core/account/account';
import { Support } from './core/support/support';
import { Capitulo1 } from './pages/capitulo1/capitulo1';
import { Capitulo2 } from './pages/capitulo2/capitulo2';
import { Capitulo3 } from './pages/capitulo3/capitulo3';
import { Capitulo4 } from './pages/capitulo4/capitulo4';
import { Capitulo5 } from './pages/capitulo5/capitulo5';
import { Capitulo6 } from './pages/capitulo6/capitulo6';

export const appRoutes: Routes = [{ path: 'Inicio', component: Inicio, pathMatch:'full'}, 
                                  { path: 'login', component: Login, pathMatch:'full'}, 
                                  { path: 'new-pass', component: NewPass, pathMatch:'full'}, 
                                  { path: 'new-pass/:uid/:token', component: NewPass, pathMatch:'full'}, 
                                  { path: 'support', component: Support, pathMatch:'full'},  
                                  { path: 'account', component: Account, pathMatch:'full'}, 
                                  { path: 'about', component: About, pathMatch:'full'},
                                  { path:'Capítulo_1', component: Capitulo1, pathMatch:'full'},
                                  { path:'Capítulo_2', component: Capitulo2, pathMatch:'full'},
                                  { path:'Capítulo_3', component: Capitulo3, pathMatch:'full'},
                                  { path:'Capítulo_4', component: Capitulo4, pathMatch:'full'},
                                  { path:'Capítulo_5', component: Capitulo5, pathMatch:'full'},
                                  { path:'Capítulo_6', component: Capitulo6, pathMatch:'full'},
                                  {path:'', redirectTo:'Inicio', pathMatch:'full'}];
