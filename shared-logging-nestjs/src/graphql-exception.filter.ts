import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { LoggerService } from './logger.service';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const context = gqlHost.getContext();

    const errorDetails = {
      message: exception.message,
      code: exception.extensions?.code,
      path: info?.path,
      operation: info?.operation?.operation,
      fieldName: info?.fieldName,
      variables: context?.req?.body?.variables,
      query: context?.req?.body?.query,
    };

    // Log del error de GraphQL
    if (exception instanceof Error) {
      this.logger.logError(exception, 'GraphQL', errorDetails);
    } else {
      this.logger.error(
        `GraphQL Error: ${exception.message}`,
        exception.stack,
        'GraphQL',
      );
    }

    return exception;
  }
}


