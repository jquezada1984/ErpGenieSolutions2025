import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno al inicio
dotenv.config();

// Debug: Verificar variables de entorno en el módulo
console.log('🔍 DEBUG - Variables de entorno en AppModule:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('---');

// Entidades
import { CuentaContable } from './entities/cuenta-contable.entity';
import { AsientoContable } from './entities/asiento-contable.entity';
import { MovimientoContable } from './entities/movimiento-contable.entity';
import { BalanceGeneral } from './entities/balance-general.entity';
import { DiarioContable } from './entities/diario-contable.entity';
import { PeriodoContable } from './entities/periodo-contable.entity';
import { LibroMayor } from './entities/libro-mayor.entity';
import { SaldoCuenta } from './entities/saldo-cuenta.entity';
import { ConfiguracionContabilidad } from './entities/configuracion-contabilidad.entity';
import { ModeloPlanContable } from './entities/modelo-plan-contable.entity';
import { PlanContable } from './entities/plan-contable.entity';
import { CuentaContableDefecto } from './entities/cuenta-contable-defecto.entity';
import { CuentaIva } from './entities/cuenta-iva.entity';
import { CuentaImpuesto } from './entities/cuenta-impuesto.entity';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';

// Resolvers
import { CuentaContableResolver } from './resolvers/cuenta-contable.resolver';
import { AsientoContableResolver } from './resolvers/asiento-contable.resolver';
import { DiarioContableResolver } from './resolvers/diario-contable.resolver';
import { PeriodoContableResolver } from './resolvers/periodo-contable.resolver';
import { LibroMayorResolver } from './resolvers/libro-mayor.resolver';
import { SaldoCuentaResolver } from './resolvers/saldo-cuenta.resolver';
import { ConfiguracionContabilidadResolver } from './resolvers/configuracion-contabilidad.resolver';
import { ModeloPlanContableResolver } from './resolvers/modelo-plan-contable.resolver';
import { PlanContableResolver } from './resolvers/plan-contable.resolver';
import { CuentaContableDefectoResolver } from './resolvers/cuenta-contable-defecto.resolver';
import { CuentaIvaResolver } from './resolvers/cuenta-iva.resolver';
import { CuentaImpuestoResolver } from './resolvers/cuenta-impuesto.resolver';
import { CuentaBancariaResolver } from './resolvers/cuenta-bancaria.resolver';

// Services
import { CuentaContableService } from './services/cuenta-contable.service';
import { AsientoContableService } from './services/asiento-contable.service';
import { DiarioContableService } from './services/diario-contable.service';
import { PeriodoContableService } from './services/periodo-contable.service';
import { LibroMayorService } from './services/libro-mayor.service';
import { SaldoCuentaService } from './services/saldo-cuenta.service';
import { ConfiguracionContabilidadService } from './services/configuracion-contabilidad.service';
import { ModeloPlanContableService } from './services/modelo-plan-contable.service';
import { PlanContableService } from './services/plan-contable.service';
import { CuentaContableDefectoService } from './services/cuenta-contable-defecto.service';
import { CuentaIvaService } from './services/cuenta-iva.service';
import { CuentaImpuestoService } from './services/cuenta-impuesto.service';
import { CuentaBancariaService } from './services/cuenta-bancaria.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'postgres'}`,
      entities: [
        CuentaContable,
        AsientoContable,
        MovimientoContable,
        BalanceGeneral,
        DiarioContable,
        PeriodoContable,
        LibroMayor,
        SaldoCuenta,
        ConfiguracionContabilidad,
        ModeloPlanContable,
        PlanContable,
        CuentaContableDefecto,
        CuentaIva,
        CuentaImpuesto,
        CuentaBancaria,
      ],
      synchronize: false, // Deshabilitado para evitar conflictos con datos existentes
      ssl: {
        rejectUnauthorized: false
      },
    }),
    TypeOrmModule.forFeature([
      CuentaContable,
      AsientoContable,
      MovimientoContable,
      BalanceGeneral,
      DiarioContable,
      PeriodoContable,
      LibroMayor,
      SaldoCuenta,
      ConfiguracionContabilidad,
      ModeloPlanContable,
      PlanContable,
      CuentaContableDefecto,
      CuentaIva,
      CuentaImpuesto,
      CuentaBancaria,
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
      sortSchema: true,
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CuentaContableResolver,
    AsientoContableResolver,
    DiarioContableResolver,
    PeriodoContableResolver,
    LibroMayorResolver,
    SaldoCuentaResolver,
    ConfiguracionContabilidadResolver,
    ModeloPlanContableResolver,
    PlanContableResolver,
    CuentaContableDefectoResolver,
    CuentaIvaResolver,
    CuentaImpuestoResolver,
    CuentaBancariaResolver,
    CuentaContableService,
    AsientoContableService,
    DiarioContableService,
    PeriodoContableService,
    LibroMayorService,
    SaldoCuentaService,
    ConfiguracionContabilidadService,
    ModeloPlanContableService,
    PlanContableService,
    CuentaContableDefectoService,
    CuentaIvaService,
    CuentaImpuestoService,
    CuentaBancariaService,
  ],
})
export class AppModule {}
