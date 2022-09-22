import { Empresa } from "./empresa";

export class Response {
    public error: boolean=false;
    public exception: string="";
    public message: string="";
 }

 export class HomeResponse extends Response {
    data: Empresa = new Empresa();
 }