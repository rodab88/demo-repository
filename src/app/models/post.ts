 export class Post{
    public accion?: string; // url_link
    public favoritos?: string;
    public fecha_publicacion: string =  new Date().toString();  
    public marca_actual?: number;
    public me_gusta?: boolean;
    public mensaje_accion?: string;
    public no_megusta?: boolean;
    public post_id: number = 0;
    public texto_corto?: string;
    public tipo_contenido_id?: number;
    public titulo?: string;

    public url_archivo?: string;
    public img_64?: string;
    public url?: string;
    public comentarios?: boolean;
 }