import { Routes } from '@angular/router';
import { NewPass } from './core/new-pass/new-pass';
import { Inicio } from './pages/Inicio/Inicio';
import { About } from './pages/Inicio/about/about';
import { Login } from './core/auth/login';
import { Account } from './core/account/account';
import { Support } from './core/support/support';
import { AcercaDe } from './pages/acerca-de/acerca-de';
import { Modelos } from './pages/modelos/modelos';
import { Avanzado } from './pages/avanzado/avanzado';
import { Diseno } from './pages/diseno/diseno';
import { SalaComun } from './pages/sala-comun/sala-comun';
import { CommunityList } from './features/communities/list/community-list';
import { CommunityDetail } from './features/communities/detail/community-detail';
import { CommunityCreate } from './features/communities/create/community-create';
import { PostDetail } from './features/posts/detail/post-detail';
import { PostCreate } from './features/posts/create/post-create';

export const appRoutes: Routes = [{ path: 'Inicio', component: Inicio, pathMatch:'full'}, 
                                  { path: 'login', component: Login, pathMatch:'full'}, 
                                  { path: 'new-pass', component: NewPass, pathMatch:'full'}, 
                                  { path: 'new-pass/:uid/:token', component: NewPass, pathMatch:'full'}, 
                                  { path: 'support', component: Support, pathMatch:'full'},  
                                  { path: 'account', component: Account, pathMatch:'full'}, 
                                  { path: 'about', component: About, pathMatch:'full'},
                                  { path:'acerca-de', component: AcercaDe, pathMatch:'full'},
                                  { path:'comunidades', component: CommunityList, pathMatch:'full'},
                                  { path:'comunidades/crear', component: CommunityCreate, pathMatch:'full'},
                                  { path:'comunidades/:id/posts', redirectTo:'comunidades/:id', pathMatch:'full'},
                                  { path:'comunidades/:id', component: CommunityDetail, pathMatch:'full'},
                                  { path:'comunidades/:communityId/posts/crear', component: PostCreate, pathMatch:'full'},
                                  { path:'comunidades/:communityId/posts/:postId', component: PostDetail, pathMatch:'full'},
                                  { path:'modelos', component: Modelos, pathMatch:'full'},
                                  { path:'avanzado', component: Avanzado, pathMatch:'full'},
                                  { path:'diseno', component: Diseno, pathMatch:'full'},
                                  { path:'sala-comun', component: SalaComun, pathMatch:'full'},
                                  {path:'', redirectTo:'Inicio', pathMatch:'full'}];
