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
    const qb = this.movRepo
      .createQueryBuilder('m')
      .where('m.id_cuenta_bancaria = :id_cuenta_bancaria', { id_cuenta_bancaria })
      .orderBy('m.fecha_movimiento', 'DESC')
      .addOrderBy('m.created_at', 'DESC');

    if (id_empresa) {
      qb.andWhere('m.id_empresa = :id_empresa', { id_empresa });
    }
    if (soloActivos) {
      qb.andWhere(
        `NOT EXISTS (
          SELECT 1 FROM movimiento_bancario rev
          WHERE rev.id_movimiento_reversado = m.id_movimiento_bancario
        )`,
      );
    }
    return qb.getMany();
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
