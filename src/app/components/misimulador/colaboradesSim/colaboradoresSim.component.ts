import { Component, Input, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';
import { MiSimuladorComponent } from '../misimulador.component';
import { ToastService } from 'src/app/toast-service';

@Component({
  selector: 'colaboradoresSim-template',
  templateUrl: './colaboradoresSim.component.html',
  styleUrls: ['./colaboradoresSim.component.css'],
})
export class MiSimuladorColaboradoresComponent implements OnInit {
  showComponents: boolean = false;


  displayProgressSpinner = false;
  @Input() arregloGen: any = [];

  item: any;
  public aceptados: any = [];
  public pendientes: any = [];
  seleccionamenuCol: boolean = false;
  public seleccionamMontoCamp: boolean = false;
  public modificaCom: boolean = false;
  public aceptaCom: boolean = false;
  public id: number = 0;
  public montoSim: string = '';
  public montoTotalAceptados: number = 0;

  constructor(public services: Services, public miSimulador: MiSimuladorComponent, public toastService: ToastService) { }


  ngOnInit(): void {
    this.datosColaboradores(String(localStorage.getItem('nomina')));
  }

  activarMenuCol(item: any) {
    this.item = item;
    this.seleccionamenuCol = !this.seleccionamenuCol;
  }

  nuevoperfil() {
    let colaboradores: any[] = JSON.parse(localStorage.getItem('colaboradores')!);
    let colab = { "nominaColaborador": String(this.item.nomina), "nominaJefe": "", "nombreColaborador": this.item.nombre };
    colaboradores.push(colab);
    localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    this.miSimulador.cargarDatos();
  }

  public actualizarCompromiso(obj: any) {
    let status = '';
    let objCompromiso: any = [];
    if (this.aceptaCom) {
      status = 'ACEPTADA';

      objCompromiso = {
        nomina: String(localStorage.getItem('nomina')),
        status: status,
        mensaje: "Sugiero que alcance un mínimo de $ " + this.montoSim,
        monto_sugerido: obj.monto
      }
    }
    else if (this.modificaCom) {

      status = 'RECHAZADA';
      if (obj.monto == '0.00') {
        objCompromiso = {
          nomina: obj.nommina,
          status: status,
          nomina_jefe: String(this.arregloGen.nomina_jefe),
          //mensaje: "Sugiero que alcance un mínimo de $ " + this.montoSim,
          monto_sugerido: this.montoSim,
          monto: this.montoSim
        }
      } else {
        objCompromiso = {
          nomina: obj.nommina,
          status: status,
          mensaje: "Sugiero que alcance un mínimo de $ " + this.montoSim,
          monto_sugerido: this.montoSim
        }

      }
    }
    this.services.postActualizaCompromiso(objCompromiso, this.id).subscribe(datos => {
      if (!datos.error) {
        this.datosColaboradores(String(localStorage.getItem('nomina')));
        if (this.aceptaCom) {
          let not = {
            title: 'Mi Compromiso',
            body: 'El compromiso se acepto correctamente',
            image: '/assets/img/accept.png'
          }
          this.toastService.show(not);
        }
        else if (this.modificaCom) {
          let not = {
            title: 'Mi Compromiso',
            body: 'El compromiso se modifico correctamente',
            image: '/assets/img/accept.png'
          }
          this.toastService.show(not);
        }
      }
    })

    this.seleccionamMontoCamp = false;

  }

  public activarMonto(obj: any) {
    if (this.aceptaCom) {
      this.activarAceptarCompro(obj);
    }
    else if (this.modificaCom) {
      this.activarModCompromiso(obj);
    }
  }

  public activarModCompromiso(obj: any) {
    if (obj.id) {
      this.id = obj.id;
    }
    this.aceptaCom = false;
    this.modificaCom = true;
    if (!this.seleccionamMontoCamp) {
      this.seleccionamMontoCamp = true;
    } else {
      this.seleccionamMontoCamp = false;
    }


  }

  public activarAceptarCompro(obj: any) {
    this.id = obj.id;
    this.aceptaCom = true;
    this.modificaCom = false;
    this.actualizarCompromiso(obj);

  }


  public datosColaboradores(nomina: string) {
    let objEquipo: any = {
      nomina: nomina
    }
    this.services.postCompromisoEquipo(objEquipo).subscribe(datos => {
      if (datos !== undefined) {
        this.montoTotalAceptados = 0;
        this.getAceptados(datos);
        this.getPendientes(datos);
        this.montoTotalAceptados = datos.data.total_liderazgo;
      }
    });
  }

  getAceptados(datos: any){
    if (datos.data.aceptados.length > 0) {
      this.aceptados = datos.data.aceptados;
      for (let item of this.aceptados) {
        item.monto = item.monto == undefined ? '0.00' : item.monto;
        item.monto_sugerido = item.monto_sugerido == undefined ? '0.00' : item.monto_sugerido;
      }
    }
  }

  getPendientes(datos: any){
    if (datos.data.pendientes.length > 0) {
      this.pendientes = datos.data.pendientes;
      for (let item of this.pendientes) {
        item.status = item.status == 'PENDIENTE' ? 'SIN COMPROMISO' : item.status;
        item.monto = item.monto == undefined ? '0.00' : item.monto;
        item.monto_sugerido = item.monto_sugerido == undefined ? '0.00' : item.monto_sugerido;
      }
    }
  }

  showProgressSpinner(value: boolean) {
    this.displayProgressSpinner = value;
  }

}
