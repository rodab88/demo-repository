import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/login/auth/auth.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { VariablesComponent } from './components/post/variables/variables.component'
import { FavoritosComponent } from './components/post/favoritos/favoritos.component'
import { PerfilComponent } from './components/perfil/perfil.component';
import { AuthGuard } from './services/auth.guard';
import { ReprodComponent } from './components/utils/reprod/reprod.component';
import { MiDiaComponent } from './components/midia/midia.component';
import { MiIncentivoComponent } from './components/miincentivo/miincentivo.component'
import { MiSimuladorComponent } from './components/misimulador/misimulador.component';
import { ValoraAppComponent } from './components/valora-app/valora-app.component'
import { ErrorComponent } from './components/error/error.component';
import { MisRetosComponent } from './components/misretos/misretos.component'
import { TourComponent } from './components/tour/tour.component';

const routes: Routes = [
  { path: '', component: AuthComponent},
  { path: 'video', component: ReprodComponent},
  { path: 'login', component: AuthComponent},
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  { path: 'variables', component: VariablesComponent, canActivate: [AuthGuard]},
  { path: 'favoritos', component: FavoritosComponent, canActivate: [AuthGuard]},
  { path: 'midia', component: MiDiaComponent, canActivate: [AuthGuard]},
  { path: 'miincentivo', component: MiIncentivoComponent, canActivate: [AuthGuard]},
  { path: 'misimulador', component: MiSimuladorComponent, canActivate: [AuthGuard]},
  { path: 'misretos', component: MisRetosComponent, canActivate: [AuthGuard]},
  { path: 'encuesta', component: ValoraAppComponent, canActivate: [AuthGuard]},
  { path: 'tour', component: TourComponent, canActivate: [AuthGuard]},
  { path: 'error', component: ErrorComponent},
  { path: '**', component: AuthComponent }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
