import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HomeRequest } from '../models/home-request';
import { HomeResponse } from '../models/home-response';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class Services {
  constructor(private http: HttpClient) {}
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // POST
  home(data: HomeRequest): Observable<HomeResponse> {
    return this.http.post<HomeResponse>(
        environment.serviceUrl + 'si/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  empresa(obj:any): Observable<any> {
    return this.http.post<any>(
        environment.serviceUrl + 'si/empresa/',
        JSON.stringify(obj),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  homeperfil(obj:any): Observable<any> {
    return this.http.post<any>(
        environment.serviceUrl + 'si/perfil/home/',
        JSON.stringify(obj),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  public postLogin(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'auth/login/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public postNotifica(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/notificaciones/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }
 
  public postBorraNotifica(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/notificacion/eliminar/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public postVistoNotifica(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/notificacion/visto/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public postDatosPerfil(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getDatosMiDia(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/dia/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getDatosMiDia2(): Observable<any>{
    return this.http.get("src/app/services/midiaResponse.json")
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getDatosinentivos(): Observable<any>{

    return this.http.get(`https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/Incentivos/get?nomina=53963&tipoNominaId=44`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public postDatosColabMiDia(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/dia_colaboradores/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public postCrearCompromiso(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/compromiso/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  } 
  public postActualizarPerfil(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/actualizar/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }
  
  public postCategoria(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/categoria/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }   
  
  public postDatosGrafica(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/dia_grafica/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  } 
  
  public postlistCaolaborador(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/colaboradores/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public postNotificaColaboradorLiderazgo(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/notificacion/push/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public postComentariosCalifica(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/calificacion/calificar/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public getComentariosCalifica(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/calificacion/mis/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getComentariosApp(obj: any): Observable<any> {
    return this.http.post<any>(environment.serviceUrl + 'si/calificacion/',
    JSON.stringify(obj),
    this.httpOptions)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getCalificacion(): Observable<any>{
    return this.http.get<any>(
      environment.serviceUrl + 'si/calificacion/votos/'
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public postCompromisoEquipo(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/compromiso/equipo/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public postCompromisoHistorial(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/compromiso/historial/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public updatePhoto(datos: FormData): Observable<any>{   
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/archivos/',
      datos
    )
    .pipe(retry(1), catchError(this.errorHandl));
  } 

  public postActualizaCompromiso(obj: any, id: number): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/perfil/compromiso/'+ id + '/revision/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }  

  public getDatos(idNomina: string): Observable<any>{    
    return this.http.get('https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/LogIn/get?nomina='+idNomina+'&bSimulador=false&bBusca=false')
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getIncentivos(): Observable<any>{    
    return this.http.get('https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/Incentivos/get?nomina=53963&tipoNominaId=44')//https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/Incentivos/get?nomina='+idNomina+'&tipoNominaId='+tipoNomina)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getPuestosSimulador(): Observable<any>{    
    return this.http.get('https://vinculacion.gentera.com.mx:9088/inc_api_gen/api/tiposNomina/lista')
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getPDF(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.servicePdf,
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public getTour(obj: any): Observable<any>{
    return this.http.post<any>(
      environment.serviceUrl + 'si/tour/',
      JSON.stringify(obj),
      this.httpOptions
    )
    .pipe(retry(1), catchError(this.errorHandl));
  } 
  
  // Error handling
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