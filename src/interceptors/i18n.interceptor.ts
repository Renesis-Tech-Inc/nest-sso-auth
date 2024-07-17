import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { I18nService } from 'nestjs-i18n';
import { catchError, map } from 'rxjs/operators';
import { EErrorMessages } from 'src/enums/error-messages.enum';

/**
 * Interceptor for internationalizing HTTP responses and error messages.
 *
 * This interceptor implements the `NestInterceptor` interface provided by NestJS
 * and is responsible for translating messages in HTTP responses and errors based
 * on the `Accept-Language` header of the incoming request.
 *
 * @class
 * @implements {NestInterceptor}
 */
@Injectable()
export class I18nInterceptor implements NestInterceptor {
  /**
   * Constructs the I18nInterceptor with the given I18nService.
   *
   * @param {I18nService} i18n - The internationalization service.
   */
  constructor(private readonly i18n: I18nService) {}

  /**
   * Intercepts the execution flow to translate messages in HTTP responses and errors.
   *
   * This method intercepts the execution flow before handling an HTTP response or error.
   * It translates messages based on the `Accept-Language` header of the incoming request.
   *
   * @param {ExecutionContext} context - The execution context of the interceptor.
   * @param {CallHandler<any>} next - The next handler in the chain to handle the request.
   * @returns {Observable<any>} An observable representing the response stream.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract the HTTP request from the execution context
    const request = context.switchToHttp().getRequest();

    // Get the 'Accept-Language' header or default to 'en' (English)
    const acceptLanguage = request.headers['accept-language'] || 'en';

    // Determine the primary language (e.g., 'en' from 'en-US')
    const primaryLanguage = acceptLanguage
      .split(',')[0]
      .split(';')[0]
      .split('-')[0];

    return next.handle().pipe(
      map((data) => {
        if (data && data?.message) {
          const { payload, message } = data;
          // Construct the translation key
          const translatedPayload =
            primaryLanguage + '.' + message.toUpperCase() || '';
          // Translate the message using the I18nService
          let translatedMessage = this.i18n.translate(translatedPayload, {
            lang: primaryLanguage,
          });

          // If the translation is not found, fallback to the original message
          if (!translatedMessage || translatedMessage === translatedPayload) {
            translatedMessage = message;
          }

          // Construct the translated response
          const translatedResponse = {
            statusCode: HttpStatus.OK,
            message: translatedMessage,
            payload: payload, // Assuming data.payload is the payload to include in the response
          };

          return translatedResponse;
        } else {
          return data;
        }
      }),
      catchError((error) => {
        if (error instanceof HttpException) {
          // Handle HttpException and translate the error message
          const status = error.getStatus();
          const message = error.message || EErrorMessages.SYSTEM_ERROR; // Default error message
          const translatedPayload =
            primaryLanguage + '.' + message.toUpperCase() || '';
          let translatedMessage = this.i18n.translate(translatedPayload, {
            lang: primaryLanguage,
          });

          // If the translation is not found, fallback to the original message
          if (!translatedMessage || translatedMessage === translatedPayload) {
            translatedMessage = message;
          }

          // Construct the translated error response
          const translatedResponse = {
            statusCode: status,
            message: translatedMessage,
          };

          // Throw the translated HttpException
          return throwError(
            () => new HttpException(translatedResponse, status),
          );
        } else {
          return throwError(() => error);
        }
      }),
    );
  }
}
