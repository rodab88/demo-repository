import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'error-template',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
})

export class ErrorComponent {

    constructor(private router: Router) { }

    return() {
        if (localStorage.getItem('nomina') == undefined || localStorage.getItem('nomina') == null) {
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['home']);
        }
    }

}