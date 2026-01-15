import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibroMayor } from '../entities/libro-mayor.entity';

@Injectable()
export class LibroMayorService {
  constructor(
    @InjectRepository(LibroMayor)
    private libroMayorRepository: Repository<LibroMayor>,
  ) {}

  async findAll(): Promise<LibroMayor[]> {
    return this.libroMayorRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<LibroMayor> {
    return this.libroMayorRepository.findOne({ where: { id } });
  }

  async findByCuenta(cuentaContableId: number): Promise<LibroMayor[]> {
    return this.libroMayorRepository.find({
      where: { cuenta_contable_id: cuentaContableId },
      order: { created_at: 'DESC' },
    });
  }

  async findByPeriodo(periodoContableId: number): Promise<LibroMayor[]> {
    return this.libroMayorRepository.find({
      where: { periodo_contable_id: periodoContableId },
      order: { cuenta_contable_id: 'ASC' },
    });
  }

  async findByCuentaYPeriodo(
    cuentaContableId: number,
    periodoContableId: number,
  ): Promise<LibroMayor | null> {
    return this.libroMayorRepository.findOne({
      where: {
        cuenta_contable_id: cuentaContableId,
        periodo_contable_id: periodoContableId,
      },
    });
  }
}
