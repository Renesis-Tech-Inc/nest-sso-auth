import { SetMetadata } from '@nestjs/common';
import { EUserRole } from 'src/enums/roles.enum';

/**
 * Decorator for specifying roles allowed for a given endpoint or resource.
 *
 * This decorator is used to specify the roles allowed for accessing a particular endpoint or resource.
 * It takes an array of `EUserRole` values representing the roles allowed to access the decorated endpoint.
 *
 * @param {...EUserRole[]} roles - The roles allowed to access the endpoint or resource.
 * @returns {any} A metadata set with the specified roles.
 */
export const RolesAllowed = (...roles: EUserRole[]) =>
  SetMetadata('roles', roles);
