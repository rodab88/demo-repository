import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: string, hora: string = ''): string {
    let fecha_retorno = value;
    if (fecha_retorno.includes('/'))
      return fecha_retorno
    try {
      let in_fecha = value.split(' ')[0]
      let in_dia = parseInt(in_fecha.split('-')[2])
      let in_mes = parseInt(in_fecha.split('-')[1])
      let in_anio = parseInt(in_fecha.split('-')[0])

      let hoy_sistema = new Date();
      let hoy_in = new Date(in_anio, in_mes, in_dia);

      if (hoy_sistema.getDate() == hoy_in.getDate())
        fecha_retorno = 'hoy'
      else if (hoy_sistema.getDate() == hoy_in.getDate() + 1)
        fecha_retorno = 'ayer'
      else
        fecha_retorno = in_dia + '/' + this.meses3[in_mes - 1] + '/' + in_anio;

      try {
        if (hora == 'hora') {
          let in_time = value.split(' ')[1]
          let in_horas = in_time.split(':')[0]
          let in_minutos = in_time.split(':')[1]
          fecha_retorno = fecha_retorno + ' ' + in_horas + ':' + in_minutos
        }
      } catch { }
    } catch { }
    return fecha_retorno
  }

  meses = ["enero"
    , "febrero"
    , "marzo"
    , "abril"
    , "mayo"
    , "junio"
    , "julio"
    , "agosto"
    , "septiembre"
    , "octubre"
    , "noviembre"
    , "diciembre"
  ]

  meses3 = ["ene"
    , "feb"
    , "mar"
    , "abr"
    , "may"
    , "jun"
    , "jul"
    , "ago"
    , "sep"
    , "oct"
    , "nov"
    , "dic"
  ]

}
