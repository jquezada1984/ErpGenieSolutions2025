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
import { ConfiguracionContabilidad } from './entities/configuracion-contabilidad.entity';
import { PeriodoContable } from './entities/periodo-contable.entity';
import { DiarioContable } from './entities/diario-contable.entity';
import { ModeloPlanContable } from './entities/modelo-plan-contable.entity';
import { PlanContable } from './entities/plan-contable.entity';
import { Pais } from './entities/pais.entity';
import { CuentaContableDefecto } from './entities/cuenta-contable-defecto.entity';

// Resolvers
import { CuentaContableResolver } from './resolvers/cuenta-contable.resolver';
import { AsientoContableResolver } from './resolvers/asiento-contable.resolver';
import { TransferenciaContableResolver } from './resolvers/transferencia-contable.resolver';
import { OperativaContableResolver } from './resolvers/operativa-contable.resolver';
import { ConfiguracionContabilidadResolver } from './resolvers/configuracion-contabilidad.resolver';
import { PeriodoContableResolver } from './resolvers/periodo-contable.resolver';
import { DiarioContableResolver } from './resolvers/diario-contable.resolver';
import { ModeloPlanContableResolver } from './resolvers/modelo-plan-contable.resolver';
import { CuentaIndividualResolver } from './resolvers/cuenta-individual.resolver';
import { CuentaContableDefectoResolver } from './resolvers/cuenta-contable-defecto.resolver';

// Services
import { CuentaContableService } from './services/cuenta-contable.service';
import { AsientoContableService } from './services/asiento-contable.service';
import { TransferenciaContableService } from './services/transferencia-contable.service';
import { OperativaContableService } from './services/operativa-contable.service';
import { ReporteContableService } from './services/reporte-contable.service';
import { ConfiguracionContabilidadService } from './services/configuracion-contabilidad.service';
import { PeriodoContableService } from './services/periodo-contable.service';
import { DiarioContableService } from './services/diario-contable.service';
import { ModeloPlanContableService } from './services/modelo-plan-contable.service';
import { PlanContableService } from './services/plan-contable.service';
import { CuentaIndividualService } from './services/cuenta-individual.service';
import { CuentaContableDefectoService } from './services/cuenta-contable-defecto.service';

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
        ConfiguracionContabilidad,
        PeriodoContable,
        DiarioContable,
        ModeloPlanContable,
        PlanContable,
        Pais,
        CuentaContableDefecto,
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
      ConfiguracionContabilidad,
      PeriodoContable,
      DiarioContable,
      ModeloPlanContable,
      PlanContable,
      Pais,
      CuentaContableDefecto,
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
    OperativaContableResolver,
    TransferenciaContableResolver,
    ConfiguracionContabilidadResolver,
    PeriodoContableResolver,
    DiarioContableResolver,
    ModeloPlanContableResolver,
    CuentaIndividualResolver,
    CuentaContableDefectoResolver,
    CuentaContableService,
    AsientoContableService,
    OperativaContableService,
    TransferenciaContableService,
    ReporteContableService,
    ConfiguracionContabilidadService,
    PeriodoContableService,
    DiarioContableService,
    ModeloPlanContableService,
    PlanContableService,
    CuentaIndividualService,
    CuentaContableDefectoService,
  ],
})
export class AppModule {}
