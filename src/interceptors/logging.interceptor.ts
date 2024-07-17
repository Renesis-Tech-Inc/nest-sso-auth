import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor for logging HTTP requests.
 *
 * This interceptor implements the `NestInterceptor` interface provided by NestJS
 * and is responsible for logging HTTP requests and their response times.
 *
 * @class
 * @implements NestInterceptor
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Intercepts the execution flow to log HTTP requests.
   *
   * This method intercepts the execution flow before and after handling an HTTP request.
   * It logs information such as the HTTP method, URL, and response time.
   *
   * @param {ExecutionContext} context - The execution context of the interceptor.
   * @param {CallHandler<any>} next - The next handler in the chain to handle the request.
   * @returns {Observable<any>} An observable representing the response stream.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const call$ = next.handle();

    return call$.pipe(
      tap(() =>
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        ),
      ),
    );
  }
}
