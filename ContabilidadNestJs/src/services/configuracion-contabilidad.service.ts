import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionContabilidad } from '../entities/configuracion-contabilidad.entity';

@Injectable()
export class ConfiguracionContabilidadService {
  constructor(
    @InjectRepository(ConfiguracionContabilidad)
    private readonly configuracionRepository: Repository<ConfiguracionContabilidad>,
  ) {}

  async obtenerPorEmpresa(id_empresa: string): Promise<ConfiguracionContabilidad> {
    const existente = await this.configuracionRepository.findOne({
      where: { id_empresa },
    });

    if (existente) {
      return existente;
    }

    // Lectura solamente: devolver defaults sin persistir.
    return {
      id_configuracion_contabilidad: '00000000-0000-0000-0000-000000000000',
      id_empresa,
      id_moneda_base: null,
      formato_cuenta: 'XXXX-XXXX-XXXX',
      separador_cuenta: '-',
      longitud_nivel: 4,
      usar_centavos: true,
      metodo_contable: 'acumulacion',
      desactivar_transacciones_directas: false,
      lista_combinada_subsidiaria: false,
      gestion_cero_final: false,
      longitud_cuentas_generales: null,
      longitud_subcuentas_terceros: null,
      periodo_por_defecto: 'mes_anterior',
      fecha_excluir_antes: null,
      etiqueta_operacion_defecto: 'tercero_apunte_desc',
      deshabilitar_transferencia_ventas: false,
      deshabilitar_transferencia_compras: false,
      deshabilitar_informes_gastos: false,
      deshabilitar_activos_fijos: false,
      deshabilitar_descuentos: false,
      usar_fecha_fin_periodo_informe_gastos: false,
      solo_lineas_conciliadas_extracto: false,
      numeracion_modelo: 'neon',
      mascara_helium: null,
      coincidencia_contable: false,
      iva_revertido_compras: false,
      tab_libro_auxiliar_terceros: false,
      prefijo_exportacion: null,
      formato_exportacion: 'csv_configurable',
      formato_archivo: 'csv',
      separador_columnas: ',',
      tipo_retorno_carro: 'unix',
      formato_fecha_exportacion: '%Y-%m-%d',
      created_at: null,
      updated_at: null,
    } as ConfiguracionContabilidad;
  }
}
