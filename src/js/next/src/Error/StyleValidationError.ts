import { ValidationError } from './ValidationError.js';

export interface StyleValidationErrorDetail {
  readonly message?: string;
  readonly instancePath?: string;
}

export class StyleValidationError extends ValidationError {
  readonly details: readonly StyleValidationErrorDetail[];

  constructor(details: readonly StyleValidationErrorDetail[]) {
    const message = details
      .map((e) => [e.instancePath, e.message].filter(Boolean).join(' '))
      .join(', ');

    super(`Invalid style definition: ${message}`);
    this.name = 'StyleValidationError';
    this.details = details;
  }
}
