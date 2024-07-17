import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Retrieves the user object from the request.
 * This decorator is used to extract the user object from the request object.
 * @param {unknown} data - Additional data passed to the decorator (ignored in this implementation).
 * @param {ExecutionContext} ctx - The execution context containing information about the request.
 * @returns {any} The user object extracted from the request.
 */
export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
