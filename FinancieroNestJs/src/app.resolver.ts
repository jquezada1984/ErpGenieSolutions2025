import { Resolver, Query } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {
    console.log('✅ AppResolver inicializado');
  }

  @Query(() => String, { name: 'hello' })
  async hello(): Promise<string> {
    return this.appService.getHello();
  }

  @Query(() => String, { name: 'test' })
  async test(): Promise<string> {
    return 'Financiero service is working!';
  }
}

