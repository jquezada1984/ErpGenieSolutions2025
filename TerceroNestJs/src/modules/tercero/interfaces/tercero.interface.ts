export interface ITercero {
    id_tercero: string;
    id_empresa: string;
  
    cliente_potencial: boolean;
    cliente: boolean;
    proveedor: boolean;
  
    nombre: string;
    apodo?: string;
    codigo_cliente?: string;
    codigo_proveedor?: string;
    estado: boolean;

    direccion?: string;
    poblacion?: string;
    codigo_postal?: string;
    id_pais?: string;
    provincia?: string;
    telefono?: string;
    movil?: string;
    fax?: string;
    correo?: string;
    web?: string;
  
    id_profesional_1?: string;
    id_profesional_2?: string;
    cif_intra?: string;
  
    sujeto_iva: boolean;
    capital?: string;
    id_condicion_pago?: string;
    id_forma_pago?: string;
  
    categoria_cliente?: string;
    categoria_proveedor?: string;
  
    sede_central?: string;
    asignado_a?: string;
    id_tipo_tercero?: string;
  
    created_by?: string;
    updated_by?: string;
    fecha_creacion?: Date;
    fecha_modificacion?: Date;
  }
  