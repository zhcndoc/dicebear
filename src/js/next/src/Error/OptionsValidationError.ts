import { ValidationError } from './ValidationError.js';

export interface OptionsValidationErrorDetail {
  readonly message?: string;
  readonly instancePath?: string;
}

export class OptionsValidationError extends ValidationError {
  readonly details: readonly OptionsValidationErrorDetail[];

  constructor(details: readonly OptionsValidationErrorDetail[]) {
    const message = details
      .map((e) => [e.instancePath, e.message].filter(Boolean).join(' '))
      .join(', ');

    super(`Invalid options: ${message}`);
    this.name = 'OptionsValidationError';
    this.details = details;
  }
}
