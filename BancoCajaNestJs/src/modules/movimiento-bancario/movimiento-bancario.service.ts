import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoBancario } from './entities/movimiento-bancario.entity';

@Injectable()
export class MovimientoBancarioService {
  constructor(
    @InjectRepository(MovimientoBancario)
    private readonly movRepo: Repository<MovimientoBancario>,
  ) {}

  findByCuenta(
    id_cuenta_bancaria: string,
    id_empresa?: string,
    soloActivos = true,
  ): Promise<MovimientoBancario[]> {
    const where: Record<string, unknown> = { id_cuenta_bancaria };
    if (id_empresa) where.id_empresa = id_empresa;
    if (soloActivos) where.estado = true;
    return this.movRepo.find({
      where,
      order: { fecha_operacion: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id_movimiento_bancario: string): Promise<MovimientoBancario> {
    const mov = await this.movRepo.findOne({
      where: { id_movimiento_bancario },
      relations: ['cuenta', 'cuenta.banco'],
    });
    if (!mov) throw new NotFoundException('Movimiento bancario no encontrado');
    return mov;
  }
}
