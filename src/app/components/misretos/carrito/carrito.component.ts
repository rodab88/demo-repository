import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Services } from 'src/app/services/services';
import { AuthService } from 'src/app/services/auth.service';
import { MisRetosComponent } from 'src/app/components/misretos/misretos.component'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialogDesc/dialog-component';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'carrito-template',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
    @Input() saldoDisponible: number = 0;
    @Output() returnFn: EventEmitter<boolean> = new EventEmitter();
    @Output() changeSaldo: EventEmitter<number> = new EventEmitter();

    saldoCarrito: number = 0;
    productos: any[] = [];
    cart: any[] = [];
    cartImpr: any[] = [];

    resumen: boolean = false;
    fecha: string = "";
    btnAcept: boolean = true;
    cantProductos: number = 0;
    colorletra: string = "";

    constructor(public dialog: MatDialog, public services: Services, public auth: AuthService, public misretos: MisRetosComponent, private currencyPipe: CurrencyPipe) { }

    ngOnInit(): void {
        let d = new Date();
        this.fecha = this.formatDate(d);
        this.getProductos();
        this.colorletra = localStorage.getItem('colorletra')!;
    }

    getProductos() {
        this.services.productos().subscribe(datos => {
            if (!datos.error) {
                console.log(datos);
                this.productos = datos.data;

                this.productos.forEach(p => {
                    this.toDataUrl(p.imagen, function (myBase64: any) {
                        p.imagenb64 = myBase64;
                        p.cantidad = 0;
                        p.costo = 0;
                        p.valor = Number(p.valor);
                    });

                });
            }
        });
    }

    ajustarCarrito(op: boolean, item: any) {
        let index = this.cart.findIndex(x => x.id === item.id)

        if (op) {
            if (index > -1) {
                let cant = (this.cart[index].cantidad - 1 < 0) ? 0 : this.cart[index].cantidad - 1;
                this.cart[index].cantidad = cant;
                this.cart[index].costo = this.cart[index].cantidad * this.cart[index].valor;
                if (cant == 0) {
                    this.cart.splice(index, 1);
                }
            }
        } else {
            let data = { icon: "retos", description: "Has excedido el saldo disponible." };
            if (index > -1) {
                if (this.cart[index].valor + this.saldoCarrito <= this.saldoDisponible) {
                    this.cart[index].cantidad += 1;
                    this.cart[index].costo = this.cart[index].cantidad * this.cart[index].valor;
                } else {
                    this.onShowMsg(data);
                }

            } else {
                if (item.valor + this.saldoCarrito <= this.saldoDisponible) {
                    item.cantidad += 1;
                    item.costo = item.cantidad * item.valor;
                    this.cart.push(item);
                } else {
                    this.onShowMsg(data);
                }
            }
        }
        this.calcularSaldo();
    }

    calcularSaldo() {
        this.saldoCarrito = 0;
        this.cantProductos = 0;
        this.cart.forEach(c => {
            this.saldoCarrito += c.costo;
            this.cantProductos += c.cantidad;
        });
    }


    volverMisRetos() {
        this.returnFn.emit(false);
    }

    onShowMsg(data: any) {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '350px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed' + result);
        });
    }

    verResumen(origin: boolean) {
        if (origin) {
            if (!this.resumen) {
                if (this.cart.length > 0)
                    this.resumen = !this.resumen;
            } else {
                if (this.btnAcept == false) {
                    this.limpiarCarrito();
                }
                this.resumen = !this.resumen;
            }
        } else {
            this.limpiarCarrito();
            this.resumen = false;
        }
    }

    limpiarCarrito() {
        this.cart = [];
        this.productos.forEach(p => {
            p.cantidad = 0;
            p.costo = 0;
        });
        this.calcularSaldo();
    }

    canjear() {
        let detalle: any[] = [];
        this.cart.forEach(c => {
            detalle.push({ "id_producto": c.id, "cantidad": c.cantidad, "valor": c.valor })
        })
        let obj = {
            "nomina": Number(localStorage.getItem("nomina")),
            "total": this.saldoCarrito,
            "detalle": detalle
        }
        this.services.canjear(obj).subscribe(datos => {
            console.log(datos);
            if (!datos.error) {
                this.services.analitica('canjearItems').subscribe();
                this.saldoDisponible = this.saldoDisponible - this.saldoCarrito;
                this.changeSaldo.emit(this.saldoDisponible);
                this.btnAcept = false;
                let data = { title: "¡Felicidades!", description: "Muy pronto recibirás tu premio, revisa tu buzón de notificaciones." }
                this.onShowMsg(data);
            }
        });
    }

    imprimirComprobante() {
        let canjes: any = [];
        this.cart.forEach(c => {
            canjes.push({ "imagenb64": c.imagenb64, "nombre": c.nombre, "cantidad": c.cantidad, "valor": this.currencyPipe.transform(c.valor), "costo": this.currencyPipe.transform(c.costo) })
        });
        let obj = {
            "idDocumentType": 225,
            "directory": "Incentivos",
            "datos": {
                "fecha_transaccion": this.fecha,
                "total_saldo": this.currencyPipe.transform(this.saldoCarrito),
                "canje": canjes
            }

        };
        this.services.getPDF(obj).subscribe(datos => {
            if (datos.ok) {
                console.log(datos);
                this.services.analitica('guardarRecibo').subscribe();
                const source = `data:application/pdf;base64,${datos.b64}`;
                const link = document.createElement("a");
                link.href = source;
                link.download = `comprobante.pdf`
                link.click();
            }
        });
    }

    toDataUrl(url: string, callback: any) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }


    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date: Date) {
        return (
            [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                this.padTo2Digits(date.getHours()),
                this.padTo2Digits(date.getMinutes()),
                this.padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }
}
