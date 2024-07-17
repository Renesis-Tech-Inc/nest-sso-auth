/**
 * Formats validation errors into a standardized response format.
 *
 * This function takes an array of validation errors and transforms them into a standardized
 * response format containing error details for each property and a status code indicating
 * validation failure.
 *
 * @param {ValidationErrors[]} ValidationErrors - The array of validation errors to be formatted.
 * @returns {object} An object containing formatted validation errors, status code, and a message indicating validation failure.
 */
export const ValidationFormatter = (ValidationErrors) => {
  const errors: any[] = [];
  ValidationErrors.forEach((error) => {
    errors.push({
      [error.property]:
        error?.constraints != undefined
          ? Object.values(error.constraints)[0]
          : 'Validation Failed',
    });
  });
  return { errors, statusCode: 422, message: 'Validation Failed' };
};
