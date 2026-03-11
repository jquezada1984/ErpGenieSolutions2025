import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AsientoContable } from '../entities/asiento-contable.entity';
import { MovimientoContable } from '../entities/movimiento-contable.entity';

@Injectable()
export class AsientoContableService {
  constructor(
    @InjectRepository(AsientoContable)
    private asientoContableRepository: Repository<AsientoContable>,
    @InjectRepository(MovimientoContable)
    private movimientoRepository: Repository<MovimientoContable>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<AsientoContable[]> {
    return this.asientoContableRepository.find({
      order: { fecha: 'DESC', numero: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AsientoContable> {
    return this.asientoContableRepository.findOne({ where: { id } });
  }

  async findMovimientosByAsiento(asientoId: number): Promise<MovimientoContable[]> {
    return this.movimientoRepository.find({
      where: { asiento_contable_id: asientoId },
      order: { id: 'ASC' },
    });
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<AsientoContable[]> {
    return this.asientoContableRepository
      .createQueryBuilder('asiento')
      .where('asiento.fecha >= :fechaInicio', { fechaInicio })
      .andWhere('asiento.fecha <= :fechaFin', { fechaFin })
      .orderBy('asiento.fecha', 'DESC')
      .addOrderBy('asiento.numero', 'DESC')
      .getMany();
  }

  async create(asientoData: Partial<AsientoContable>): Promise<AsientoContable> {
    const asiento = this.asientoContableRepository.create(asientoData);
    return this.asientoContableRepository.save(asiento);
  }

  async update(id: number, asientoData: Partial<AsientoContable>): Promise<AsientoContable> {
    await this.asientoContableRepository.update(id, asientoData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.asientoContableRepository.update(id, { estado: 'ANULADO' });
  }

  async aprobar(id: number): Promise<AsientoContable> {
    await this.asientoContableRepository.update(id, { estado: 'APROBADO' });
    return this.findOne(id);
  }

  /** Obtiene el siguiente número de asiento (usa función BD si existe). */
  async obtenerSiguienteNumero(empresaId: number, prefijo: string, fecha: Date): Promise<string> {
    const raw = await this.dataSource.query<{ obtener_siguiente_numero_asiento: string }[]>(
      'SELECT obtener_siguiente_numero_asiento($1, $2, $3) AS obtener_siguiente_numero_asiento',
      [empresaId, prefijo || 'GEN', fecha],
    );
    if (raw?.[0]?.obtener_siguiente_numero_asiento) {
      return raw[0].obtener_siguiente_numero_asiento;
    }
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const count = await this.asientoContableRepository.count({
      where: { empresa_id: empresaId },
    });
    return `${prefijo || 'GEN'}-${anio}-${mes}-${String(count + 1).padStart(6, '0')}`;
  }

  /**
   * Publicar asiento (BORRADOR → APROBADO). Valida: partida doble, al menos 2 líneas,
   * ninguna línea con debe y haber en cero, ninguna con ambos > 0.
   */
  async publicarAsiento(id: number): Promise<AsientoContable> {
    const asiento = await this.findOne(id);
    if (!asiento) throw new BadRequestException('Asiento no encontrado');
    if (asiento.estado !== 'BORRADOR') {
      throw new BadRequestException('Solo se puede publicar un asiento en estado BORRADOR');
    }

    const lineas = await this.findMovimientosByAsiento(id);
    if (lineas.length < 2) {
      throw new BadRequestException('El asiento debe tener al menos 2 líneas para publicar');
    }

    const totalDebe = Number(asiento.total_debe);
    const totalHaber = Number(asiento.total_haber);
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      throw new BadRequestException('Partida doble no cuadra: total debe debe ser igual a total haber');
    }

    for (const lin of lineas) {
      const d = Number(lin.debe);
      const h = Number(lin.haber);
      if (d === 0 && h === 0) {
        throw new BadRequestException('No puede haber líneas con debe y haber en cero');
      }
      if (d > 0 && h > 0) {
        throw new BadRequestException('Una línea no puede tener debe y haber mayores a cero');
      }
    }

    await this.asientoContableRepository.update(id, { estado: 'APROBADO' });
    return this.findOne(id);
  }

  /**
   * Reversar asiento (APROBADO → genera asiento reverso y marca original REVERSED).
   */
  async reversarAsiento(id: number, usuarioId?: number): Promise<AsientoContable> {
    const asiento = await this.findOne(id);
    if (!asiento) throw new BadRequestException('Asiento no encontrado');
    if (asiento.estado !== 'APROBADO') {
      throw new BadRequestException('Solo se puede reversar un asiento en estado APROBADO');
    }

    const lineas = await this.findMovimientosByAsiento(id);
    if (lineas.length === 0) {
      throw new BadRequestException('Asiento sin movimientos');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const fechaReverso = new Date();
      const numeroReverso = await this.obtenerSiguienteNumero(
        asiento.empresa_id!,
        'REV',
        fechaReverso,
      );

      let totalDebe = 0;
      let totalHaber = 0;
      const lineasReverso: Array<{ cuenta_contable_id: number; debe: number; haber: number; concepto: string | null }> = [];
      for (const lin of lineas) {
        const d = Number(lin.debe);
        const h = Number(lin.haber);
        lineasReverso.push({
          cuenta_contable_id: lin.cuenta_contable_id,
          debe: h,
          haber: d,
          concepto: lin.concepto,
        });
        totalDebe += h;
        totalHaber += d;
      }

      const repoAsiento = queryRunner.manager.getRepository(AsientoContable);
      const repoMov = queryRunner.manager.getRepository(MovimientoContable);

      const reverso = repoAsiento.create({
        numero: numeroReverso,
        fecha: fechaReverso,
        concepto: `Reversión de asiento ${asiento.numero}`,
        total_debe: totalDebe,
        total_haber: totalHaber,
        estado: 'APROBADO',
        empresa_id: asiento.empresa_id,
        usuario_id: usuarioId ?? asiento.usuario_id,
        reversed_entry_id: asiento.id,
      });
      const savedReverso = await repoAsiento.save(reverso);

      for (const lin of lineasReverso) {
        await repoMov.save(
          repoMov.create({
            asiento_contable_id: savedReverso.id,
            cuenta_contable_id: lin.cuenta_contable_id,
            debe: lin.debe,
            haber: lin.haber,
            concepto: lin.concepto,
          }),
        );
      }

      await repoAsiento.update(asiento.id, { estado: 'REVERSED' });
      await queryRunner.commitTransaction();
      return (await this.findOne(savedReverso.id))!;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
