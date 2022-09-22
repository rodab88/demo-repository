import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Services } from 'src/app/services/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],

})

export class NotificacionesComponent implements OnInit,OnDestroy {

    showHeader: boolean = false;
    public seleccionamenu: boolean = false;
  
    public arreglo: any = [];
 
    public suscripcion!:Subscription;

    public filtroNotifica: number = 0;

    public objNotifica: any = [];
    public leidos: any = [];
    public noLeidos: any = [];
    public todos: any = [];
    public indiceNotifica: number = 0;
    public botonSalir: boolean = false;
  
    constructor( private router: Router,
      public services: Services
    ) { }
  
    ngOnInit(): void {
      this.traerListaNomina();
    }
  
    public traerListaNomina() {

      let objenviar =
      {
        nomina: localStorage.getItem('nomina')
      }
      this.services.postNotifica(objenviar).subscribe(datos => {
        this.todos=[];
        this.leidos=[];
        this.noLeidos=[];
        this.arreglo=[];
        this.arreglo = datos.data;
        this.todos = datos.data;

        if(this.arreglo){
          for(let item of this.arreglo){
              if(item.visto){
                this.leidos.push(item);
              }else{
                this.noLeidos.push(item);
              }
          }
        }
 
      });
    }
  
    public activarMenu(obj:any, indice: number){

      this.objNotifica = obj;
      this.indiceNotifica = indice;

      if(!this.seleccionamenu){
        this.seleccionamenu= true;
      }else{
        this.seleccionamenu= false;
      }

    }
  
  
    public eliminar() {
      let objenviar =
      {
        nomina: localStorage.getItem('nomina'),
        notificacion_id: this.objNotifica.notificacion_id
      }
      this.services.postBorraNotifica(objenviar).subscribe(datos => {

        if(!datos.error){
          this.arreglo.splice(this.indiceNotifica, 1);
          this.seleccionamenu= false;
        }
 
      });

  
    }

    public cierreModal(){
      
      this.seleccionamenu = false;
    }

    public filtroVisto(){
      
      let valor = this.filtroNotifica;
      this.seleccionamenu = false;
      if(valor == 1){
        this.arreglo = this.leidos;
      }else if(valor == 2){
        this.arreglo = this.noLeidos;
      }else if(valor == 0){
        this.arreglo = this.todos;
      }

    }

    public visto() {
      
      let objenviar =
      {
        nomina: localStorage.getItem('nomina'),
        notificacion_id: this.objNotifica.notificacion_id
      }
      this.services.postVistoNotifica(objenviar).subscribe(datos => {

        if(!datos.error){
          let valor = this.filtroNotifica;
          if(valor == 2){
            this.arreglo.splice(this.indiceNotifica, 1);
            this.seleccionamenu= false;
          }else{
          this.ngOnInit();
          }
          this.seleccionamenu= false;
        }
 
      });

  
    }
  
  

  
    ngOnDestroy():void{
      if(this.suscripcion){
          this.suscripcion.unsubscribe();
      }
    }
          
  }
  