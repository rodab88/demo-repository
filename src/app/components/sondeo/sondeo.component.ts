import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MSondeoComponent } from './modal/msondeo.component';
import { interval } from 'rxjs';
import { DialogComponent } from '../dialogDesc/dialog-component';
import { Services } from 'src/app/services/services';
import { data } from 'jquery';

@Component({
    selector: 'sondeo-template',
    templateUrl: './sondeo.component.html',
    styleUrls: ['./sondeo.component.css']
})
export class SondeoComponent implements OnInit {

    subFunction: any;
    progressbarValue = 100;
    curSec: number = 0;
    segRest: string = "00:35";
    segundos: number = 35;
    respuesta: any = [];
    public ocultaIntento: boolean = false;

    sondeoArray: any = [];

    divPresentacion: boolean = false;
    divPreguntas: boolean = false;
    divRespuestas: boolean = false;
    public aprovado: boolean = false;

    totalPreguntas: number = 0;
    totalAciertos: number = 0;

    gameOver: boolean = false;
    intentos: number = 1;
    nomina: number = 0;

    intentarOtraVez: boolean = false;

    constructor(private router: Router, public dialog: MatDialog, public services: Services) {

    }

    ngOnInit() {
        this.nomina = parseInt(localStorage.getItem('nomina')!);
        this.cargaSondeo();
    }

    cargaSondeo() {
        this.gameOver = false;
        let obj = {
            "nomina": this.nomina
        }
        this.services.quizz(obj).subscribe(datos => {
            if (!datos.error) {
                if (datos.data && datos.data.preguntas.length > 0) {
                    this.divPresentacion = true;
                    this.sondeoArray = datos.data;
                    this.setTiempo(datos.data.tiempo_sondeo);

                    this.sondeoArray = {
                        id: datos.data.id,
                        titulo: datos.data.titulo_sondeo,
                        valor: datos.data.monto_ganar,
                        intentos: datos.data.intentos,
                        porcentaje_aprobacion: datos.data.minimo_aprobacion,
                        indicaciones: datos.data.indicaciones_sondeo,
                        nombre_insignia: datos.data.nombre_insignia,
                        imagen_portada: datos.data.imagen_portada,
                        img_insignia: datos.data.imagen_insignia,
                        premio_saldo: datos.data.premio_saldo,
                        premio_insignia: datos.data.premio_insignia,
                        preguntas: this.configPreguntas()
                    }
                    this.totalPreguntas = this.sondeoArray.preguntas.length;
                } else {
                    this.router.navigate(['/home']);
                }
            } else {
                this.router.navigate(['/home']);
            }
        });
    }

    configPreguntas() {
        let preguntas: any[] = [];
        let validar: boolean = false;
        for (let i = 0; i < this.sondeoArray.preguntas.length; i++) {
            let correcta = this.sondeoArray.preguntas[i].tipo !== 1 ? true : false;
            let respuestas: any = [];
            if (this.sondeoArray.preguntas[i].tipo == 1) {
                respuestas = JSON.parse(this.sondeoArray.preguntas[i].respuestas).radios
                validar = respuestas[0].status == undefined ? false : true;
            }
            if (this.sondeoArray.preguntas[i].tipo == 3) {
                respuestas = {
                    filas: JSON.parse(this.sondeoArray.preguntas[i].respuestas).filas,
                    columnas: JSON.parse(this.sondeoArray.preguntas[i].respuestas).columnas
                }
            }

            preguntas.push({
                idTipoPregunta: this.sondeoArray.preguntas[i].tipo,
                id: i + 1,
                retroalimentacion: this.sondeoArray.preguntas[i].retroalimentacion,
                pregunta: this.sondeoArray.preguntas[i].pregunta,
                respuestas: respuestas,
                validar: validar,
                multiple: this.sondeoArray.preguntas[i].multiple,
                status: correcta,
                obligatoria: this.sondeoArray.preguntas[i].obligatorio,
                id_simbolo: this.sondeoArray.preguntas[i].simbolo,
                id_Nivel: this.sondeoArray.preguntas[i].niveles,
                id_pregunta: this.sondeoArray.preguntas[i].id
            }
            );
        }
        return preguntas;
    }

    setTiempo(seg: number) {
        this.segundos = seg * 60;
        this.segRest = (seg > 9 ? seg.toString() : ("0" + seg)) + ":00";
    }

    iniciar() {
        this.divPresentacion = false;
        this.divPreguntas = true;
        this.startTimer();
    }

    validacionEnvio() {

        if (this.gameOver) {
            this.enviar();
        } else {
            let total = this.sondeoArray.preguntas.filter((x: any) => x.obligatoria)
            let respondidas = this.sondeoArray.preguntas.filter((x: any) => (x.idTipoPregunta == 1 || x.idTipoPregunta == 2) && x.obligatoria && x.respuestasUsuario !== null && x.respuestasUsuario !== undefined && x.respuestasUsuario.length > 0)
            let tp4 = this.sondeoArray.preguntas.filter((x: any) => x.idTipoPregunta == 4 && x.obligatoria && x.respuestasUsuario !== null && x.respuestasUsuario !== undefined);
            let p3 = this.sondeoArray.preguntas.filter((x: any) => x.idTipoPregunta == 3 && x.obligatoria);
            let tp3 = 0;
            p3.forEach((p: any) => {
                if (p.respuestasUsuario)
                    tp3 = tp3 + (p.respuestasUsuario.length == p.respuestas.filas.length ? 1 : 0);
            });
            if ((respondidas.length + tp4.length + tp3) == total.length) {
                this.enviar();
            } else {
                this.dialog.open(DialogComponent, {
                    width: '350px',
                    data: { name: "Error", description: "Debe contestar todas las preguntas obligatorias" }
                });
            }
        }

    }

    enviar() {
        this.subFunction.unsubscribe();
        this.validarRespuestas();
        let respuestas = this.totalAciertos + "/" + this.totalPreguntas;
        let calif = (this.totalAciertos * 100) / this.totalPreguntas;
        let img = calif >= this.sondeoArray.porcentaje_aprobacion ? this.sondeoArray.img_insignia : '/assets/img/fail.png';
        let etiqueta = calif >= this.sondeoArray.porcentaje_aprobacion ? "¡Felicidades!" : "Vuelve a intentarlo";
        let aprobado = calif >= this.sondeoArray.porcentaje_aprobacion ? true : false;
        let rspSnd: any[] = [];
        this.sondeoArray.preguntas.forEach((p: any) => {
            if (p.respuestasUsuario) {
                if (p.respuestasUsuario.length > 0) {
                    if (p.idTipoPregunta == 1) {
                        let rp = "";
                        let status = false;
                        p.respuestasUsuario.forEach((rpUsr: any) => {
                            rp += rpUsr.respuesta + " / ";
                        });
                        rp = rp.slice(0, -3)
                        if (p.validar) {
                            let rsp: any[] = [];
                            p.respuestas.forEach((r: any) => {
                                if (r.status)
                                    rsp.push({ id: r.idradio, respuesta: r.nombreradio, estatus: r.status })
                            });
                            status = JSON.stringify(rsp) == JSON.stringify(p.respuestasUsuario) ? true : false;
                        } else {
                            p.status = true;
                        }
                        rspSnd.push({ "id_pregunta": p.id_pregunta, "respuesta": rp, "correcta": status });
                    } else {
                        p.respuestasUsuario.forEach((rpUsr: any) => {
                            rspSnd.push({ "id_pregunta": p.id_pregunta, "respuesta": rpUsr.respuesta, "correcta": rpUsr.estatus });
                        });
                    }
                } else {
                    rspSnd.push({ "id_pregunta": p.id_pregunta, "respuesta": p.respuestasUsuario.respuesta, "correcta": p.respuestasUsuario.estatus });
                }
            } else {
                rspSnd.push({ "id_pregunta": p.id_pregunta, "respuesta": '', "correcta": false });
            }

        });
        let objSend = {
            "quizz_id": this.sondeoArray.id,
            "nomina": this.nomina,
            "aprobada": aprobado,
            "calificacion": calif,
            "respuestas": rspSnd
        }
        this.services.quizz_respuestas(objSend).subscribe(datos => {
            if (!datos.error) {

                this.dialog.open(MSondeoComponent, {
                    width: '500px',
                    data: { img: img, etiqueta: etiqueta, aprobado: aprobado, respuestas: respuestas, saldo: this.sondeoArray.valor, insignia: this.sondeoArray.premio_insignia, premio: this.sondeoArray.premio_saldo }
                }).afterClosed().subscribe(response => {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                    this.divPreguntas = false;
                    this.divRespuestas = true;


                });

                this.intentarOtraVez = !aprobado && datos.data.reintento ? true : false;

                if (!datos.data.reintento) {
                    this.aprovado = true;
                }

            }
        });
    }

    validarRespuestas() {
        this.sondeoArray.preguntas.forEach((p: any) => {
            p.status = p.obligatoria && p.respuestasUsuario ? true : false;
            if (p.idTipoPregunta == 1) {
                if (p.validar) {
                    let rsp: any[] = [];
                    p.respuestas.forEach((r: any) => {
                        if (r.status)
                            rsp.push({ id: r.idradio, respuesta: r.nombreradio, estatus: r.status })
                    });
                    p.status = JSON.stringify(rsp) == JSON.stringify(p.respuestasUsuario) ? true : false;
                } else {
                    p.status = true;
                }
            }
        });
        this.totalAciertos = this.sondeoArray.preguntas.filter((pregunta: any) => pregunta.status).length;
        this.sondeoArray.preguntas.forEach((pregunta: any) => {
            pregunta.imgsrc = "/assets/img/" + (pregunta.status ? "correcta" : "incorrecta") + ".png"
            pregunta.lblStatus = pregunta.status ? "Correcta" : "Incorrecta"
        });
    }

    accion(val: boolean) {

        if (val) {
            this.router.navigate(['/home']);
        } else {
            this.divPresentacion = true;
            this.divPreguntas = false;
            this.divRespuestas = false;
            this.progressbarValue = 100;
            this.intentarOtraVez = false;
            this.cargaSondeo();
        }
    }

    startTimer() {
        const timer$ = interval(1000);
        this.subFunction = timer$.subscribe((sec) => {
            this.progressbarValue = 100 - sec * 100 / this.segundos;
            this.curSec = sec;
            this.segRest = this.secondsToHms(this.segundos - this.curSec);
            if (this.curSec === this.segundos) {
                this.subFunction.unsubscribe();
                this.gameOver = true;
                this.validacionEnvio();
            }
        });
    }

    secondsToHms(d: number) {
        d = Number(d);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var mDisplay = m > 0 ? (m > 9 ? m + ":" : "0" + m + ":") : "00:";
        var sDisplay = s > 0 ? (s > 9 ? s : "0" + s) : "00";
        return mDisplay + sDisplay;
    }

    respuestas(val: any) {
        let p = this.sondeoArray.preguntas.findIndex((x: any) => x.id === val.id)
        this.sondeoArray.preguntas[p].respuestasUsuario = val.respuestas;
    }

}
