import { Provider, Inject } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { Connection } from 'mongoose';
import { EDependencyTokens } from 'src/enums/dependency-tokens.enum';

/**
 * Represents a Typegoose class constructor.
 */
export interface TypegooseClass {
  new (...args: any[]): any;
}

/**
 * Generates a model token by appending a suffix to the model name.
 *
 * @param {string} modelName - The name of the model.
 * @returns {string} The generated model token.
 */
export function getModelToken(modelName: string): string {
  return modelName + EDependencyTokens.DB_MODEL_TOKEN_SUFFIX;
}

/**
 * Retrieves a NestJS provider configuration for a Typegoose class.
 *
 * @param {TypegooseClass} typegooseClass - The Typegoose class constructor.
 * @returns {Provider} The provider configuration object.
 */
export function getProviderByTypegooseClass(
  typegooseClass: TypegooseClass,
): Provider {
  return {
    provide: getModelToken(typegooseClass.name),
    useFactory: (connection: Connection) =>
      getModelForClass(typegooseClass, { existingConnection: connection }),
    inject: [EDependencyTokens.DB_CONNECTION_TOKEN],
  };
}

/**
 * Decorator function to inject a Typegoose model into a class constructor.
 *
 * @param {TypegooseClass} model - The Typegoose class constructor to inject.
 * @returns {ParameterDecorator} The parameter decorator function.
 */
export function InjectModel(model: TypegooseClass) {
  return Inject(getModelToken(model.name));
}
