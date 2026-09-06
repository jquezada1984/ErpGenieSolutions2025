import { Test, TestingModule } from '@nestjs/testing';
import { FinancieroResolver } from './financiero.resolver';
import { FinancieroLecturaService } from '../services/financiero-lectura.service';

describe('FinancieroResolver', () => {
  let resolver: FinancieroResolver;
  const lectura = {
    listarCondicionesPago: jest.fn(),
    listarFormasPago: jest.fn(),
    listarMonedas: jest.fn(),
    obtenerFacturaCliente: jest.fn(),
    listarFacturasCliente: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancieroResolver,
        { provide: FinancieroLecturaService, useValue: lectura },
      ],
    }).compile();
    resolver = module.get(FinancieroResolver);
  });

  it('condicionesPagoFin propaga id_empresa', async () => {
    lectura.listarCondicionesPago.mockResolvedValue([]);
    await resolver.condicionesPagoFin('emp-1');
    expect(lectura.listarCondicionesPago).toHaveBeenCalledWith(true, 'emp-1');
  });

  it('facturaCliente exige id_empresa', async () => {
    lectura.obtenerFacturaCliente.mockResolvedValue(null);
    await resolver.facturaCliente('f1', 'emp-9');
    expect(lectura.obtenerFacturaCliente).toHaveBeenCalledWith('f1', 'emp-9');
  });
});
