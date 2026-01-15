import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('configuracion_contabilidad')
export class ConfiguracionContabilidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa_id: number;

  @Column()
  moneda_base_id: number;

  @Column({ length: 20, default: 'XXXX-XXXX-XXXX' })
  formato_cuenta: string;

  @Column({ length: 5, default: '-' })
  separador_cuenta: string;

  @Column({ default: 4 })
  longitud_nivel: number;

  @Column({ default: true })
  usar_centavos: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
