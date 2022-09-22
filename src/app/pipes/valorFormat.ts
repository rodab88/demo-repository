import { Pipe, PipeTransform } from '@angular/core';
import { IntTCampo } from './IntTCampo';

@Pipe({ name: 'valorFormat' })
export class ValorFormat implements PipeTransform {
    
    tFormat = {
        tipoCampoId: 1,
        nombre: "Moneda",
        simbolo: "$",
        decimales: 2,
        redondea: false,
    };

    transform(value: any, tc?: IntTCampo): string {
        if (!value) value = 0;
        else if (!this.valNumber(value)) return value.toString();

        if (!tc) tc = this.tFormat;
        if (value > 999999999) tc.decimales = 0;

        let options = {
            style: "decimal",
            currency: "USD", // el formato ingles es el que separa correctamente los miles el español falla
            minimumFractionDigits: tc.decimales,
            maximumFractionDigits: tc.decimales
        }

        switch (tc.simbolo) {
            case '%': options.style = "percent"; break;
            case '$': options.style = "currency"; break;
        }

        return new Intl.NumberFormat("en-us", options).format(value)
    }

    valNumber(n: any): boolean {
        return Number(n) == n && isFinite(n);
    }
}

