import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    userData: any;
    constructor(public router: Router, private http: HttpClient) { }
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };
    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = localStorage.getItem('nomina');
        return user !== null ? true : false;
    }

    public AuthLogin(obj: any): Observable<any> {
        return this.http.post<any>(
            environment.serviceUrl + 'auth/login/',
            JSON.stringify(obj),
            this.httpOptions
        )
            .pipe(retry(1), catchError(this.errorHandl));
    }

    public permisos(obj: any): Observable<any> {
        return this.http.post<any>(
            environment.serviceUrl + 'auth/permisos/',
            JSON.stringify(obj),
            this.httpOptions
        )
            .pipe(retry(1), catchError(this.errorHandl));
    }

    public idTipoEmpresa(obj: any): Observable<any> {
        return this.http.post<any>(
            environment.serviceColaboradoresUrl,
            JSON.stringify(obj))
            .pipe(retry(1), catchError(this.errorHandl));
    }

    // Sign out
    SignOut() {
        localStorage.clear()
        this.router.navigate(['/']);
    }

    SignOutInit() {
        localStorage.clear()
    }

    errorHandl(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(() => {
            return errorMessage;
        });
    }
}