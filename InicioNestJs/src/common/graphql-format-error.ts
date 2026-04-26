import { GraphQLFormattedError } from 'graphql';

/**
 * Evita filtrar al cliente mensajes de excepción, stacktraces u otros detalles internos.
 * En producción: registra el error en servidor y devuelve mensajes genéricos cuando aplica.
 *
 * GraphQLFormattedError usa propiedades readonly; no mutamos, devolvemos objetos nuevos.
 */
export function sanitizeGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const isProd = process.env.NODE_ENV === 'production';

  const baseExtensions = formattedError.extensions
    ? ({ ...formattedError.extensions } as Record<string, unknown>)
    : undefined;

  if (baseExtensions && isProd) {
    delete baseExtensions.exception;
    delete baseExtensions.stacktrace;
  }

  const withExtensions = (ext: Record<string, unknown> | undefined): GraphQLFormattedError =>
    ({
      ...formattedError,
      extensions: ext && Object.keys(ext).length > 0 ? ext : undefined,
    }) as GraphQLFormattedError;

  if (!isProd) {
    return withExtensions(baseExtensions);
  }

  const code = String(baseExtensions?.code ?? '');

  if (code === 'UNAUTHENTICATED' || code === 'FORBIDDEN') {
    const message =
      code === 'UNAUTHENTICATED'
        ? 'Sesión no válida o expirada.'
        : 'No tiene permiso para esta operación.';
    return {
      ...formattedError,
      message,
      extensions: baseExtensions,
    } as GraphQLFormattedError;
  }

  const looksInternal =
    code === 'INTERNAL_SERVER_ERROR' ||
    /password_hash|bcrypt|ECONNREFUSED|QueryFailedError|deadlock/i.test(formattedError.message);

  if (looksInternal) {
    console.error('[GraphQL]', formattedError.message, error);
    const ext = { ...(baseExtensions ?? {}), code: 'INTERNAL_ERROR' };
    return {
      ...formattedError,
      message: 'No se pudo completar la operación.',
      extensions: ext,
    } as GraphQLFormattedError;
  }

  return withExtensions(baseExtensions);
}
