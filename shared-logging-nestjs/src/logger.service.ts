import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private readonly logDir: string;
  private readonly serviceName: string;

  constructor(
    serviceName: string = 'nestjs-service',
    logDir?: string,
    logLevel?: string,
  ) {
    this.serviceName = serviceName;
    this.logDir = logDir || process.env.LOG_DIR || './logs';

    // Crear directorio de logs si no existe
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Configurar formato de logs
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0 && meta.service) {
          msg = `${timestamp} [${level}] [${meta.service}]: ${message}`;
        }
        if (Object.keys(meta).length > 1) {
          const { service, ...rest } = meta;
          if (Object.keys(rest).length > 0) {
            msg += ` ${JSON.stringify(rest)}`;
          }
        }
        return msg;
      }),
    );

    // Crear logger de Winston
    this.logger = winston.createLogger({
      level: logLevel || process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: { service: this.serviceName },
      transports: [
        // Logs de error en archivo separado
        new winston.transports.File({
          filename: path.join(this.logDir, `${this.serviceName}-error.log`),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Todos los logs en un archivo
        new winston.transports.File({
          filename: path.join(this.logDir, `${this.serviceName}-combined.log`),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Console para desarrollo
        new winston.transports.Console({
          format: consoleFormat,
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(this.logDir, `${this.serviceName}-exceptions.log`),
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join(this.logDir, `${this.serviceName}-rejections.log`),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, {
      trace,
      context,
      stack: trace,
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Métodos adicionales para logging estructurado
  logError(error: Error, context?: string, metadata?: Record<string, any>) {
    this.logger.error({
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      ...metadata,
    });
  }

  logInfo(message: string, metadata?: Record<string, any>, context?: string) {
    this.logger.info(message, { context, ...metadata });
  }

  logWarning(message: string, metadata?: Record<string, any>, context?: string) {
    this.logger.warn(message, { context, ...metadata });
  }
}


