import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { from, Observable } from 'rxjs';
import { catchError, mapTo, switchMap, tap } from 'rxjs/operators';
import { Connection } from 'mongoose';
import { EDependencyTokens } from 'src/enums/dependency-tokens.enum';

/**
 * Interceptor for managing MongoDB transactions.
 *
 * This interceptor implements the `NestInterceptor` interface provided by NestJS
 * and is responsible for starting, committing, or aborting MongoDB transactions
 * using a Mongoose connection.
 *
 * @class
 * @implements {NestInterceptor}
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  /**
   * Constructs the TransactionInterceptor with the given Mongoose Connection.
   *
   * @param {Connection} connection - The Mongoose connection used to start sessions.
   */
  constructor(@InjectConnection() private readonly connection: Connection) {}

  /**
   * Intercepts the execution flow to manage MongoDB transactions.
   *
   * This method intercepts the execution flow before handling an HTTP request and
   * manages the MongoDB transaction lifecycle, including starting, committing, and
   * aborting transactions.
   *
   * @param {ExecutionContext} context - The execution context of the interceptor.
   * @param {CallHandler<any>} next - The next handler in the chain to handle the request.
   * @returns {Promise<Observable<any>>} A promise that resolves to an observable representing the response stream.
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // Extract the HTTP context from the execution context
    const ctx = context.switchToHttp();

    // Start a new MongoDB session
    const session = await this.connection.startSession();

    // Assign the session to the context for later access via a custom decorator
    ctx[EDependencyTokens.MONGO_SESSION_KEY] = session;

    // Start the transaction
    session.startTransaction();

    // Chain of RxJS Observables to manage the transaction lifecycle
    return next.handle().pipe(
      // SwitchMap to commit the transaction if it's in progress
      switchMap((data) =>
        from(
          session.inTransaction()
            ? session.commitTransaction()
            : Promise.resolve(),
        ).pipe(mapTo(data)),
      ),
      // End the session after the transaction is completed
      tap(() => session.inTransaction() && session.endSession()),
      // Catch and handle errors, aborting the transaction if necessary
      catchError(async (err) => {
        if (session.inTransaction()) {
          await session.abortTransaction();
          session.endSession();
        }
        throw err;
      }),
    );
  }
}
