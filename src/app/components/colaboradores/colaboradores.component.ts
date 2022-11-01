import { Component, ViewChild } from "@angular/core";
import { Services } from 'src/app/services/services';
import { PerfilComponent } from 'src/app/components/perfil/perfil.component';
import { AppComponent } from "src/app/app.component";
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { NotificacionColaboradoresComponent } from 'src/app/components/notificacion-colaboradores/notificacion-colaboradores.component';
import { environment } from "src/environments/environment";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'colaboradores-template',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css'],
})

export class ColaboradoresComponent {

  public arreglo: any = [];
  public ordenColaborador: number = 0;
  public seleccionamenu: boolean = false;
  public seleccionamenuCol: boolean = false;
  public objCol: any = [];
  public nomcol: string = "";
  public seleccionorden: any = [];
  public ordenPrincipal: number = 0;
  public selactivarPor: boolean = false;
  public seleccionamenuOrden: boolean = false;
  public selecionadoOrden: string = '';
  public fondoImg: string = '';
  public idOrdenSelect: number = 0;


  auxColaboradores: any[] = [];

  filtros = [
    { "id": 0, "value": "Incentivo Promedio" },
    { "id": 1, "value": "Incentivos ganados" },
    { "id": 2, "value": "Categoría del Desempeño" },
    { "id": 3, "value": "Estrategia" },
    { "id": 4, "value": "Nombre" },
    { "id": 5, "value": "Oficina" },
    { "id": 6, "value": "Subdirección" },
    { "id": 7, "value": "Dirección" }
  ];
  filtroselected: number = 0;

  categoriaSelected = new FormControl('');
  categorias: string[] = ["Muy Alto", "Alto", "Medio", "Bajo", "Muy Bajo"];

  tipo: string = "menor"
  promedio: number = 0;

  valor: string = "";
  user: string = "";

  public verFiltros: boolean= false;

  constructor(public services: Services,
    public perfil: PerfilComponent, private app: AppComponent, private matDialog: MatDialog, public auth: AuthService ) {

  }

  ngOnInit(): void {
    this.fondoImg = String(localStorage.getItem('imgenFondo'));
    this.traerListaNominaIni(false);
  }

  public nuevoperfil() {

    localStorage.setItem('nominaJefe', String(localStorage.getItem('nominaColaborador')));
    localStorage.setItem('nominaColaborador', String(this.objCol.nomina))
    this.app.back = 'perfil';
    this.seleccionamenuCol = false;
    this.services.analitica('irPerfilColaborador').subscribe();
    this.traerListaNominaIni(true);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  public ordenar(obj: any) {
    this.idOrdenSelect = obj;
    let ordenSelec = obj;
    if (ordenSelec == 4) {
      this.selecionadoOrden = 'Mayor a Menor';
      if (this.ordenPrincipal == 1) {
        this.arreglo.sort((a: any, b: any) => {

          if (a.incentivo_prom > b.incentivo_prom) {
            return -1;
          }
          if (a.incentivo_prom < b.incentivo_prom) {
            return 1;
          }
          return 0;
        });
      } else if (this.ordenPrincipal == 2) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.num_incentivos > b.num_incentivos) {
            return -1;
          }
          if (a.num_incentivos < b.num_incentivos) {
            return 1;
          }
          return 0;
        });
      }

    } else if (ordenSelec == 5) {
      this.selecionadoOrden = 'Menor a Mayor';
      if (this.ordenPrincipal == 1) {
        this.arreglo.sort((a: any, b: any) => {

          if (a.incentivo_prom < b.incentivo_prom) {
            return -1;
          }
          if (a.incentivo_prom > b.incentivo_prom) {
            return 1;
          }
          return 0;
        });
      } else if (this.ordenPrincipal == 2) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.num_incentivos < b.num_incentivos) {
            return -1;
          }
          if (a.num_incentivos > b.num_incentivos) {
            return 1;
          }
          return 0;
        });
      }
    } else if (ordenSelec == 2) {

      this.selecionadoOrden = 'Muy Alto a Muy Bajo';
      this.arreglo.sort((a: any, b: any) => {
        if (a.idCategoria > b.idCategoria) {
          return -1;
        }
        if (a.idCategoria < b.idCategoria) {
          return 1;
        }
        return 0;
      });
    } else if (ordenSelec == 3) {
      this.selecionadoOrden = 'Muy Bajo a Muy Alto';
      this.arreglo.sort((a: any, b: any) => {
        if (a.idCategoria < b.idCategoria) {
          return -1;
        }
        if (a.idCategoria > b.idCategoria) {
          return 1;
        }
        return 0;
      });
    } else if (ordenSelec == 0) {
      this.selecionadoOrden = 'Alfabéticamente A-Z';
      if (this.ordenPrincipal == 4) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.estrategia < b.estrategia) {
            return -1;
          }
          if (a.estrategia > b.estrategia) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 5) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.nombre < b.nombre) {
            return -1;
          }
          if (a.nombre > b.nombre) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 6) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.ubicacion < b.ubicacion) {
            return -1;
          }
          if (a.ubicacion > b.ubicacion) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 7) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.subdireccion < b.subdireccion) {
            return -1;
          }
          if (a.subdireccion > b.subdireccion) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 8) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.direccion < b.direccion) {
            return -1;
          }
          if (a.direccion > b.direccion) {
            return 1;
          }
          return 0;
        });
      }
    } else if (ordenSelec == 1) {
      this.selecionadoOrden = 'Alfabéticamente Z-A';
      if (this.ordenPrincipal == 4) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.estrategia > b.estrategia) {
            return -1;
          }
          if (a.estrategia < b.estrategia) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 5) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.nombre > b.nombre) {
            return -1;
          }
          if (a.nombre < b.nombre) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 6) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.ubicacion > b.ubicacion) {
            return -1;
          }
          if (a.ubicacion < b.ubicacion) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 7) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.subdireccion > b.subdireccion) {
            return -1;
          }
          if (a.subdireccion < b.subdireccion) {
            return 1;
          }
          return 0;
        });
      }
      if (this.ordenPrincipal == 8) {
        this.arreglo.sort((a: any, b: any) => {
          if (a.direccion > b.direccion) {
            return -1;
          }
          if (a.direccion < b.direccion) {
            return 1;
          }
          return 0;
        });
      }
    }

    this.selactivarPor = false;
    //this.ordenPrincipal = 0;
  }

  public activarMenuOrden() {
    this.selactivarPor = false;
    this.seleccionamenu = false;
    if (!this.seleccionamenuOrden) {
      this.seleccionamenuOrden = true;
    } else {
      this.seleccionamenuOrden = false;
    }
  }

  public activarModalOrden(obj: any) {
    this.objCol = obj;

    if (!this.seleccionorden) {
      this.seleccionorden = true;
    } else {
      this.seleccionorden = false;
    }

  }

  public activarPor() {
    
    this.selactivarPor = false;
    if (this.ordenPrincipal == 0) {
      this.selactivarPor = false;
    } else {
      this.selactivarPor = true;
    }
  }

  public seccionFiltros() {
    this.selactivarPor = false;
    this.seleccionamenuOrden = false;
    if (!this.seleccionamenu) {
      this.seleccionamenu = true;
      this.filtroselected = 0;
      this.categoriaSelected = new FormControl('');
      this.auxColaboradores = this.arreglo;
      this.tipo = "menor"
      this.promedio = 0;
      this.valor = "";
    } else {
      this.seleccionamenu = false;
      this.arreglo = this.auxColaboradores;
    }
  }

  changeFiltros() {
    this.arreglo = this.auxColaboradores;
    switch (Number(this.filtroselected)) {
      case 0:
      case 1:
        this.tipo = "menor"
        this.promedio = 0;
        this.onChangePromedio();
        break;
      case 2:
        this.categoriaSelected = new FormControl('');
        this.auxColaboradores = this.arreglo;
        this.filtrarCategoria();
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        this.valor = "";
        break;
    }
  }

  public activarMenuCol(obj: any) {

    this.objCol = obj;

    if (!this.seleccionamenuCol) {
      this.seleccionamenuCol = true;
    } else {
      this.seleccionamenuCol = false;
    }

  }

  filtrarCategoria() {
    this.arreglo = this.auxColaboradores.filter(x => this.categoriaSelected.value!.includes(x.categoria));
  }



  onChangePromedio() {
    if (this.filtroselected == 0) {
      if (this.tipo == "menor") {
        this.arreglo = this.auxColaboradores.filter(x => x.incentivo_prom <= Number(this.promedio));
      } else {
        this.arreglo = this.auxColaboradores.filter(x => x.incentivo_prom >= Number(this.promedio));
      }
    } else {
      if (this.tipo == "menor") {
        this.arreglo = this.auxColaboradores.filter(x => x.num_incentivos <= Number(this.promedio));
      } else {
        this.arreglo = this.auxColaboradores.filter(x => x.num_incentivos >= Number(this.promedio));
      }
    }

  }

  onChangeValor() {
    let name = "";
    switch (Number(this.filtroselected)) {
      case 3:
        name = "estrategia"
        break;
      case 4:
        name = "nombre"
        break;
      case 5:
        name = "ubicacion"
        break;
      case 6:
        name = "subdireccion"
        break;
      case 7:
        name = "direccion"
        break;
    }

    this.arreglo = this.auxColaboradores.filter(x => x[name].toUpperCase().includes(this.valor.toUpperCase()));
  }

  public traerListaNominaIni(origin: boolean) {
    let nomina = localStorage.getItem('nominaColaborador');
    let objenviar = {
      nomina: nomina,
      empresa_id: '13'
    }
    this.services.postlistCaolaborador(objenviar).subscribe(datos => {
      if (!datos.error) {
        if (datos.data.colaboradores.length !== 0) {
          let colaborador = 'true';
          localStorage.setItem('boolColaborador', colaborador);
          this.arreglo = datos.data.colaboradores;
          this.verFiltros = true;
          for (let item of this.arreglo) {

            if (item.estrategia) {
              item.estrategia = item.estrategia.substr(0, 19);

            }
            if(item.nombre.length > 29){
              item.cambioLetra = true;
              item.nombre = item.nombre.substr(0, 30);
            }
            if(item.nombre.length < 29){
              item.cambioLetra = false;
            }
            if(item.categoria){
            if(item.categoria.length > 5){
              item.cambioLetraCat= true;
            }
            if(item.categoria.length < 5){
              item.cambioLetraCat = false;
            }
            if (item.categoria == 'Muy Alto') {
              item.idCategoria = 5;
            }
            else if (item.categoria == 'Alto') {
              item.idCategoria = 4;
            }
            else if (item.categoria == 'Medio') {
              item.idCategoria = 3;
            }
            else if (item.categoria == 'Bajo') {
              item.idCategoria = 2;
            }
            else if (item.categoria == 'Muy Bajo') {
              item.idCategoria = 1;
            }
            
            }
            if (item.foto == null || item.foto == 'foto' || item.foto == '') {
              item.userCarDefault = false;
            }
            if (item.foto !== null && item.foto !== 'foto' && item.foto !== '') {
              item.userCarDefault = true;
            }
          }
        } else {
          let colaborador = 'false';
          localStorage.setItem('boolColaborador', colaborador);
        }

        if (origin) {
          this.perfil.validaPerfil();
        }       
      }
    });
  }

  public traerListaNomina(obj: any) {

    let contador = localStorage.getItem('contador');
    let contadormas = Number(contador) + 1;
    localStorage.setItem('contador', String(contadormas));
    console.log("Funciona contador --->", localStorage.getItem('contador'));
    let objenviar = {
      nomina: obj.nomina,
      empresa_id: '13'
    }
    localStorage.setItem('nominaJefe', String(obj.nomina));
    this.services.postlistCaolaborador(objenviar).subscribe(datos => {

      if (!datos.error) {
        let colaborador = ''
        if (datos.data.colaboradores.length !== 0) {
          colaborador = 'true';
          localStorage.setItem('boolColaborador', colaborador);
          this.arreglo = datos.data.colaboradores;
          for (let item of this.arreglo) {

            if (item.estrategia) {
              item.estrategia = item.estrategia.substr(0, 19);

            }
            if(item.nombre.length > 20){
              item.cambioLetra = true;
            }
            if(item.nombre.length < 20){
              item.cambioLetra = false;
            }
            if(item.categoria){
            if(item.categoria.length > 5){
              item.cambioLetraCat= true;
            }
            if(item.categoria.length < 5){
              item.cambioLetraCat = false;
            }

            if (item.categoria == 'Muy Alto') {
              item.idCategoria = 5;
            }
            else if (item.categoria == 'Alto') {
              item.idCategoria = 4;
            }
            else if (item.categoria == 'Medio') {
              item.idCategoria = 3;
            }
            else if (item.categoria == 'Bajo') {
              item.idCategoria = 2;
            }
            else if (item.categoria == 'Muy Bajo') {
              item.idCategoria = 1;
            }
            
            }
            if (item.foto == null || item.foto == 'foto' || item.foto == '') {
              item.userCarDefault = false;
            }
            if (item.foto !== null && item.foto !== 'foto' && item.foto !== '') {
              item.userCarDefault = true;
            }
          }
          let nominajefe = localStorage.getItem('NominaColaborador');
          localStorage.setItem('NominaJefe', String(nominajefe));
          localStorage.setItem('NominaColaborador', datos.data.jefe);

        } else {
          colaborador = 'false';
          localStorage.setItem('boolColaborador', colaborador);
          localStorage.setItem('NominaColaboradorFin', datos.data.jefe);

        }

        this.perfil.validaPerfil();
      }
    });
  }

  keyPressNumbers(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }



  //Para notificaciones al colaborador

  modalNotificacion(){
    this.seleccionamenuCol= false;
    localStorage.setItem('nominaColaboradorNotifica', String(this.objCol.nomina))
    this.matDialog.open(NotificacionColaboradoresComponent, {
      width: '80%',
      autoFocus: false,
      disableClose: true
      // panelClass: 'custom-modalbox'
    });
  }

  //Para abrir chat de Teams

  chatTeams(){
    this.seleccionamenuCol= false;
    let nominaTipo = {
      "nominas": [String(this.objCol.nomina)]
    }
    //Mandar a llamar un segundo servicio para obtener el ID de la empresa para la url de TEAMS
      this.auth.idTipoEmpresa(nominaTipo).subscribe(resp => {
        if(resp[0].empresaId == 1){
         this.user = resp[0].nombreUsuario+"@gentera.com.mx";
        }else if(resp[0].empresaId == 4){
         this.user = resp[0].nombreUsuario+"@compartamos.com";
        }
        this.services.analitica('iniciarTeamsColaborador').subscribe(datos=>{
          window.open(environment.urlTeams+this.user);
        });
        
      });
  }

}
