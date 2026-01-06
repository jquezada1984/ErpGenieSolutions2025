import { Module, Global, DynamicModule } from '@nestjs/common';
import { LoggerService } from './logger.service';

export interface LoggerModuleOptions {
  serviceName?: string;
  logDir?: string;
  logLevel?: string;
}

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: () => {
            return new LoggerService(
              options.serviceName || 'nestjs-service',
              options.logDir,
              options.logLevel,
            );
          },
        },
      ],
      exports: [LoggerService],
    };
  }
}


