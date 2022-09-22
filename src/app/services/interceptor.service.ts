import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(public router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        return next.handle(request).pipe(tap(() => { }, (err: any) => {
            if (err instanceof HttpErrorResponse)
                this.router.navigate(['error']);
        }));
    }
}