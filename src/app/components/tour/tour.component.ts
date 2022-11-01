import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { Services } from 'src/app/services/services';

@Component({
    selector: 'app-tour',
    templateUrl: './tour.component.html',
    styleUrls: ['./tour.component.css'],
})
export class TourComponent implements OnInit {
    index = 0;
    tours: any[] = [];
    portada: string = "";
    portadaD: string = "";
    tourId: number = 0;
    public avance: number = 1;
    public setInterval: string = '';
    public carouseltour: Subscription | undefined = undefined;
    public id: Subscription | undefined = undefined;
    public porcentaje: number = 0;
    public timeCarousel: number = 0;
    public progress: boolean = false;

    constructor(private router: Router, private services: Services) { }

    ngOnInit(): void {
        let t = JSON.parse(localStorage.getItem('tours')!)
        this.tourId = t.id;
        let i = 0;
        let txtarray = t.texto_portada.split("{{");
        let txtPortada = t.texto_portada;
        if (txtarray.length > 1) {
            txtPortada = txtarray[0];
            let nombre = String(localStorage.getItem('nombre'));
            txtPortada = txtPortada + (txtarray[1].includes('nombre') ? nombre : "");
        }
        this.tours.push({ "id": i, "text": txtPortada, "src": t.url_portada, "tipo": "portada", "show": true, "tiempo": t.tiempo_portada });
        this.portada = "url('" + t.url_portada + "')";
        this.portadaD = "linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),url('" + t.url_portada + "')";
        if (t.texto_video1 !== "") {
            i++;
            this.tours.push({ "id": i, "text": t.texto_video1, "src": t.url_video1, "tipo": t.tipo_video1, "show": false, "tiempo": t.tiempo_video1 });
        }
        if (t.texto_video2 !== "") {
            i++;
            this.tours.push({ "id": i, "text": t.texto_video2, "src": t.url_video2, "tipo": t.tipo_video2, "show": false, "tiempo": t.tiempo_video2 });
        }
        if (t.texto_video3 !== "") {
            i++;
            this.tours.push({ "id": i, "text": t.texto_video3, "src": t.url_video3, "tipo": t.tipo_video3, "show": false, "tiempo": t.tiempo_video3 });
        }
        if (t.texto_video4 !== "") {
            i++;
            this.tours.push({ "id": i, "text": t.texto_video4, "src": t.url_video4, "tipo": t.tipo_video4, "show": false, "tiempo": t.tiempo_video4 });
        }
        if (t.texto_video5 !== "") {
            i++;
            this.tours.push({ "id": i, "text": t.texto_video5, "src": t.url_video5, "tipo": t.tipo_video5, "show": false, "tiempo": t.tiempo_video5 });
        }
        if (t.texto_video6 !== "") {
            i++;
            this.tours.push({ "id": i, "text": t.texto_video6, "src": t.url_video6, "tipo": t.tipo_video6, "show": false, "tiempo": t.tiempo_video6 });
        }
        i++;
        this.tours.push({ "id": i, "text": "", "src": "", "tipo": "fin", "show": false });

        // this.carousel();
        //this.move();


    }

    public consecutivoCarousel() {

        this.tours.forEach(t => {
            t.show = false;
        });
        this.tours[this.avance].show = true;
        if (this.tours[this.avance].tipo !== 'fin') {
            this.avance++;
        }

    }


    public move() {
        this.porcentaje = 1
        let intervalPer = this.timeCarousel / 11;
        this.id = interval(intervalPer).subscribe(() => {
            this.frame();
        });
    }

    public frame() {
        if (this.porcentaje >= 100) {
            if (this.tours[this.avance].tipo !== 'fin') {
                this.porcentaje = 1;
            } else {
                this.progress = true;
            }

        } else {
            this.porcentaje = this.porcentaje + 10;
        }
    }

    public carousel() {

        if (this.tours[0].tiempo !== 0 && this.tours[0].tiempo !== '') {
            this.timeCarousel = this.tours[0].tiempo;
        } else {
            this.timeCarousel = 5000
        }
        this.carouseltour = interval(this.timeCarousel).subscribe(() => {
            if (this.tours[this.avance].tiempo !== 0 && this.tours[this.avance].tiempo !== '') {
                this.timeCarousel = this.tours[0].tiempo;
            } else {
                this.timeCarousel = 5000
            }

            this.consecutivoCarousel();

        });

    }


    jumpToSlide(i: number) {
        this.tours.forEach(t => {
            t.show = false;
        });
        this.tours[i].show = true;
        this.avance = i;
        this.porcentaje = 1;
        this.progress = false;
    }

    finalizar() {
        let obj = {
            "nomina": parseInt(localStorage.getItem('nomina')!),
            "tour_id": this.tourId
        }
        this.services.vistoTour(obj).subscribe(datos => {
            this.services.analitica('finalizarTour').subscribe();
            this.router.navigate(['/sondeo']);
            //this.router.navigate(['/home']);

        });
    }

    volverEmpezar() {
        this.tours.forEach(t => {
            t.show = false;
        });
        this.tours[0].show = true;
        this.avance = 0;
        this.porcentaje = 1;
        this.progress = false;
        this.services.analitica('volverEmpezarTour').subscribe();
    }
}
