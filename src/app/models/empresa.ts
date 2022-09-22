export class Empresa {
    public banner: string="";
    public categoria: string="";
    public categoria_sig: string="";
    public color_categoria: string="";
    public color_categoria_sig: string="";
    public color_iconos:string="";
    public color_letra: string="";
    public color_primario: string="";
    public color_secundario: string="";
    public favoritos: Favorito[] =[];

    public fecha_actualiza: string="";
    public hora_actualiza: string="";
    public icono_clara: string="";
    public icono_perfil: string="";
    public iconosi: string="";
    public id: string="";
    public incentivo_al_dia: string="";
    public mi_compromiso: string="";
    public me_impulsa: string="";
    public nombre: string="";     
    public notificacion_nueva: boolean=false;
    public posts: Post[] =[];  
    public semaforo_activo: number=0;
    
 }

 export class Favorito{
    public empresa_id: string="";
    public miniatura: string="";
    public post_id: number = 0;
 }

 export class Post {
   public fecha_publicacion: string="";
   public miniatura_banner: string="";
   public post_id: string="";
   public texto_corto: string="";
   public titulo: string="";
 }
