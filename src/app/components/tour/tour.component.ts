import { Component, OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

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
    public avance: number = 1;
    public setInterval: string= '';
    public carouseltour: Subscription | undefined = undefined;

    constructor(private router: Router) { }

    ngOnInit(): void {
        
        let t = JSON.parse(localStorage.getItem('tours')!);
        let i = 0;
        this.tours.push({ "id": i, "text": t.texto_portada, "src": t.url_portada, "tipo": "portada", "show": true ,"tiempo": t.tiempo_portada});
        this.portada = "url('" + t.url_portada + "')";
        this.portadaD = "linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),url('" + t.url_portada + "')";
        if (t.texto_video1 !== ""){
            i++;
            this.tours.push({ "id": i, "text": t.texto_video1, "src": t.url_video1, "tipo": "video", "show": false,"tiempo": t.tiempo_video1 });
        }
        if (t.texto_video2 !== ""){
            i++;
            this.tours.push({ "id": i, "text": t.texto_video2, "src": t.url_video2, "tipo": "video", "show": false,"tiempo": t.tiempo_video2 });
        }
        if (t.texto_video3 !== ""){
            i++;
            this.tours.push({ "id": i, "text": t.texto_video3, "src": t.url_video3, "tipo": "video", "show": false,"tiempo": t.tiempo_video3 });
        }
        if (t.texto_video4 !== ""){
            i++;
            this.tours.push({ "id": i, "text": t.texto_video4, "src": t.url_video4, "tipo": "video", "show": false,"tiempo": t.tiempo_video4 });
        }
        if (t.texto_video5 !== ""){
            i++;
            this.tours.push({ "id": i, "text": t.texto_video5, "src": t.url_video5, "tipo": "video", "show": false,"tiempo": t.tiempo_video5 });
        }
        if (t.texto_video6 !== ""){
            i++;
            this.tours.push({ "id": i, "text": t.texto_video6, "src": t.url_video6, "tipo": "video", "show": false,"tiempo": t.tiempo_video6 });
        }
        i++;
        this.tours.push({ "id": i, "text": "", "src": "", "tipo": "fin", "show": false });

        this.carousel();


    }

    public consecutivoCarousel() {

        this.tours.forEach(t => {
            t.show = false;
        });
        this.tours[this.avance].show=true;
        if(this.tours[this.avance].tipo !=='fin'){
        this.avance++;
        }

    } 

    public carousel() {
        let timeCarousel: number = 0;
        if(this.tours[0].tiempo !== 0 && this.tours[0].tiempo !== ''){
            timeCarousel = this.tours[0].tiempo;
        } else{
            timeCarousel = 5000
        }
        this.carouseltour = interval(timeCarousel).subscribe(()=>{
            if(this.tours[this.avance].tiempo !== 0 && this.tours[this.avance].tiempo !== ''){
                timeCarousel = this.tours[0].tiempo;
            } else{
                timeCarousel = 5000
            }

            this.consecutivoCarousel();

        });
        
}


    jumpToSlide(i: number) {
        this.tours.forEach(t => {
            t.show = false;
        });
        this.tours[i].show=true;
        this.avance= i;
    }

    finalizar() {
        this.router.navigate(['/home']);
    }

    volverEmpezar() {
        this.tours.forEach(t => {
            t.show = false;
        });
        this.tours[0].show = true;
        this.avance= 0;
    }
}
