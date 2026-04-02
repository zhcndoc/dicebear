import { ValidationError } from './ValidationError.js';
import type { ValidationErrorDetail } from './ValidationError.js';

export class OptionsValidationError extends ValidationError {
  constructor(details: readonly ValidationErrorDetail[]) {
    super('Invalid options', details);
    this.name = 'OptionsValidationError';
  }
}
