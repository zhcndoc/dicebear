import { ValidationError } from './ValidationError.js';
import type { ValidationErrorDetail } from './ValidationError.js';

export class StyleValidationError extends ValidationError {
  constructor(details: readonly ValidationErrorDetail[]) {
    super('Invalid style definition', details);
    this.name = 'StyleValidationError';
  }
}
