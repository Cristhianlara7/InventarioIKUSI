export interface LoginResponse {
    token: string;
    user: Usuario;
  }
  
  export interface Usuario {
    id?: string;
    _id?: string;
    nombre: string;
    email: string;
    rol: string;
  }