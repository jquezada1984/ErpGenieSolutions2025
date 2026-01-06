import { Resolver, Query } from '@nestjs/graphql';
import { AppService } from './app.service';
import { LoggerService } from '@erp/shared-logging-nestjs';

@Resolver()
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('✅ AppResolver inicializado', 'AppResolver');
  }

  @Query(() => String, { name: 'hello' })
  async hello(): Promise<string> {
    try {
      this.logger.logInfo('Ejecutando query hello', { query: 'hello' }, 'AppResolver');
      return this.appService.getHello();
    } catch (error) {
      this.logger.logError(error as Error, 'AppResolver', { query: 'hello' });
      throw error;
    }
  }

  @Query(() => String, { name: 'test' })
  async test(): Promise<string> {
    try {
      this.logger.logInfo('Ejecutando query test', { query: 'test' }, 'AppResolver');
      return 'Financiero service is working!';
    } catch (error) {
      this.logger.logError(error as Error, 'AppResolver', { query: 'test' });
      throw error;
    }
  }
}
