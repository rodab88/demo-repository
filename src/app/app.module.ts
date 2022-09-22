import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Services } from '../app/services/services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/login/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';

// FIREBASE
import { initializeApp } from "firebase/app";
initializeApp(environment.firebase);

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { MatSidenavModule } from '@angular/material/sidenav';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { HeaderComponent } from './components/utils/header/header.component';
import { PostComponent } from './components/post/post/post.component';
import { FavoritosComponent } from './components/post/favoritos/favoritos.component';
import { VariablesComponent } from './components/post/variables/variables.component';

import { MaterialModules } from './material-module';

import { ToastsContainer } from './toasts-container.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderGeneralComponent } from './components/header/header.component';
import { FechaPipe } from './pipes/fecha.pipe';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DesempenioComponent } from './components/desempenio/desempenio.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { FotoPerfilComponent } from './components/perfil/fotoPerfil/foto-perfil.component';
import { CommentComponent } from './components/post/comment/comment.component';
import { ColaboradoresComponent } from './components/colaboradores/colaboradores.component'
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareComponent } from './components/post/share/share.component';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { ReprodComponent } from './components/utils/reprod/reprod.component';
import { MiDiaComponent } from './components/midia/midia.component';
import { CardMiDiaComponent } from './components/cardmidia/cardmidia.component'
import { MiDiaColaboradoresComponent } from './components/midia/colaborades/dcolaboradores.component';
import { PdfViewerModule }  from  'ng2-pdf-viewer';
import { CardIncentivoComponent } from './components/miincentivo/cardincentivo/cardincentivo.component'
import { MiIncentivoComponent } from './components/miincentivo/miincentivo.component'
import { MiSimuladorComponent } from './components/misimulador/misimulador.component';
import { CardSimuladorComponent } from './components/misimulador/cardsimulador/cardsimulador.component'
import { NotificacionColaboradoresComponent } from './components/notificacion-colaboradores/notificacion-colaboradores.component';
import { AyudaComponent } from './components/ayuda/ayuda.component'
import { MiSimuladorColaboradoresComponent } from './components/misimulador/colaboradesSim/colaboradoresSim.component'
import { MiIncentivoColaboradoresComponent } from './components/miincentivo/colaboradores/icolaboradores.component';
import { NotificacionLiderazgoComponent } from './components/notificacion-liderazgo/notificacion-liderazgo.component';
import { ValorFormat } from './pipes/valorFormat';
import { ValoraAppComponent } from './components/valora-app/valora-app.component';
import { ComentarioComponent } from './components/valora-app/comentario/comentario.component'
import { MiSimuladorCopromisoComponent } from './components/misimulador/colaboradoresComp/colaboradoresComp.component'
import { CardGraficasComponent } from './components/cardgraficas/cardgraficas.component'
import { HttpInterceptorService } from './services/interceptor.service';
import { ErrorComponent } from './components/error/error.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyPipe } from '@angular/common';
import { MisRetosComponent } from './components/misretos/misretos.component'
import { TourComponent } from './components/tour/tour.component';
import { MisRetosResumenComponent } from './components/misretos/resumen/resumen.component'
import { DialogComponent } from './components/dialogDesc/dialog-component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    NotificacionesComponent,
    HeaderComponent,
    PostComponent,
    FavoritosComponent,
    VariablesComponent,
    ToastsContainer,
    FooterComponent,
    HeaderGeneralComponent,
    FechaPipe,
    PerfilComponent,
    DesempenioComponent,
    FotoPerfilComponent,
    CommentComponent,
    ColaboradoresComponent,
    ShareComponent,
    ReprodComponent,
    MiDiaComponent,
    CardMiDiaComponent,
    MiDiaColaboradoresComponent,
    CardIncentivoComponent,
    MiIncentivoComponent, 
    MiSimuladorComponent,
    CardSimuladorComponent,
    NotificacionColaboradoresComponent,
    AyudaComponent,
    MiSimuladorColaboradoresComponent,
    MiIncentivoColaboradoresComponent,
    NotificacionLiderazgoComponent,
    ValorFormat,
    MiSimuladorCopromisoComponent,
    ValoraAppComponent,
    ComentarioComponent,
    CardGraficasComponent,
    ErrorComponent,
    MisRetosComponent,
    TourComponent,
    MisRetosResumenComponent,
    DialogComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    NgApexchartsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    PdfViewerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production//, registrationStrategy: 'registerWhenStable:30000'
    }),
    
    MaterialModules,
    NgxYoutubePlayerModule.forRoot(),
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    CurrencyMaskModule
    // PickerModule
  ],
  providers: [
    CurrencyPipe,
    ValorFormat,
    Services,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    AuthService, AuthGuard,

    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
